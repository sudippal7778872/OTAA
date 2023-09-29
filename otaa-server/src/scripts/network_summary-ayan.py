import sys
import pyshark
import json
import networkx as nx
from pyvis.network import Network
import pymongo
from datetime import datetime

get_file=sys.argv[1]
get_UserID=sys.argv[2]
if len(sys.argv) != 3:
    sys.exit(1)

mongodb_url = "mongodb+srv://sudip:11VaqrpNHegrc2xH@cluster0.kwt4qdm.mongodb.net/otaa?retryWrites=true&w=majority"
database_name = "otaa"
collection_name = "networks"


cap=pyshark.FileCapture(get_file)

def get_transport_protocol(pkt): #for transport layer protocol
    return pkt.transport_layer

def get_timestamps(pkt):
    return pkt.frame_info.time

def get_ip(pkt):

    if pkt.layers[1].layer_name=="ip":
        return pkt.ip.src, pkt.ip.dst
    elif pkt.layers[1].layer_name=="ipv6":
        return pkt.ipv6.src, pkt.ipv6.dst
    elif pkt.layers[1].layer_name=="arp":
        return pkt.eth.src, pkt.eth.dst
    else:
        return pkt.eth.src, pkt.eth.dst
    
def get_higher_layer_protocol(pkt): # for OT/IT protocols
    try:
        x=""
        common_protocol=['s7comm','cotp','enip','cip','omron','bacnet','modbus','mms','lldp','arp','cdp','ssdp',
                            'http','telnet','ftp','dns','mdns','nbns','dnp3','goose','tcp','udp','ecat','dhcpv6','snmp','https']

        frame_protocol_1=[] 
        ip_str=""
        protocols=[]
        for i in range(1,len(pkt.layers)):
            ip_str=ip_str+str(pkt.layers[i].layer_name)+" "
        frame_protocol_1=ip_str.split(" ")
        frame_protocol_1=frame_protocol_1[:-1]

        for i in range(len(frame_protocol_1)):
            if frame_protocol_1[i] in common_protocol:
                protocols.append(frame_protocol_1[i])
            else:
                pass
        for i in protocols:
            x=x+i+" "
        x=x[:-1]
        return x
    except:
        pass


def get_port(pkt):
    if pkt.layers[1].layer_name=="arp" : # we have to pass because there is no port involved during arp
        return "ARP", "ARP"
    elif pkt.layers[1].layer_name=="lldp":
        return "LLDP", "LLDP"
    elif pkt.layers[2].layer_name=="tcp" :
        return str(pkt.layers[2].srcport), str(pkt.layers[2].dstport)
    elif pkt.layers[2].layer_name=="udp":
        return str(pkt.layers[2].srcport), str(pkt.layers[2].dstport)
    else:
        return "NO TRANSPORT LAYER", "NO TRANSPORT LAYER"

def driver_function():
    final_dict={}
    summary=[]
    network_summary={}
    network_graph = nx.Graph()
    try:
        for pkt in cap:    
            s_ip,d_ip=get_ip(pkt)
            port=get_port(pkt)
            s_port,d_port=port
            length=int(pkt.frame_info.len)
            key=f'{s_ip} to {d_ip}'
            
            if key not in network_summary:
                network_summary[key]={
                "Device_A":s_ip,
                "Device_B":d_ip,
                "First_Seen_Date":pkt.frame_info.time,
                "Last_Seen_Date": "",
                "Total_Bandwidth":length,
                "Protocol":get_transport_protocol(pkt),
                "Port":set([s_port,d_port]),
                "Conversation":[],

            }
            else:
                network_summary[key]["Total_Bandwidth"] = network_summary[key]["Total_Bandwidth"]+length
                network_summary[key]["Port"].add(s_port)
                network_summary[key]["Port"].add(d_port)

            network_summary[key]["Last_Seen_Date"] = str(datetime.fromtimestamp(float(pkt.sniff_timestamp)))
            higher_protocols=get_higher_layer_protocol(pkt)
            network_graph.add_edge(s_ip, d_ip)
            conver = {
                #"Frame_Number":pkt.frame_info.number,
                "Timestamp":get_timestamps(pkt) ,
                "Source": s_ip,
                "to": d_ip,
                "Protocol": get_transport_protocol(pkt),
                "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                "Bytes_Exchanged":length,
                "Source_Port": s_port,
                "to_Port": d_port,
                #"Source_MAC":pkt.eth.src,
                #"Destination_MAC":pkt.eth.dst
            }

            network_summary[key]["Conversation"].append(conver)
        for conversation in network_summary.values():
            conversation["Port"] = ", ".join(map(str, conversation["Port"]))
        
        network_json = nx.node_link_data(network_graph)
        
        for node in network_json["nodes"]:
            node["label"] = node["id"]

        for edge in network_json["links"]:
            edge["from"] = edge.pop("source")
            edge["to"] = edge.pop("target")

        network_json["edges"] = network_json.pop("links")
        
        summary.append(network_summary)
        summary=list(network_summary.values())
        
        final_dict["UserID"]=get_UserID
        final_dict["Network_Summary"]=summary
        final_dict["Network_Graph"]=network_json

        #print(final_dict)
        my_json=json.dumps(final_dict, indent=4)
        # print(my_json)
        # file_location="network.json"
        # with open(file_location, "w") as json_file:
        #     json.dump(final_dict, json_file)
        client = pymongo.MongoClient(mongodb_url)
        db = client[database_name]
        collection = db[collection_name]
        result=collection.insert_one(final_dict)
        # print(user_data)
        print(f"Inserted document with ID: {result.inserted_id}")
    except:
        pass

driver_function()





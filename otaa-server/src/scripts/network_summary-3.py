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
#file_path = r"C:\Users\User\OneDrive\Desktop\mac-vendor-wireshark.txt"
file_path = r"/home/kathan/ICS-Parser/mac-vendor1.txt"
def extract_names_from_mac_file(file_path):
    mac_names = {}
    
    with open(file_path, 'r', encoding='utf-8') as file:
        for line in file:
            if line.strip():  
                mac_prefix = line[:8].upper()
                mac_names[mac_prefix] = line[9:].split(None,1)[1].replace('\n','')  
    return mac_names

result = extract_names_from_mac_file(file_path) # This dictionary contains all the MAC mappings of all the vendor

def get_vendor_from_file(mac_address):
    mac_address = str(mac_address)
    mac_address = mac_address[:8].upper()
    if mac_address in result:
        return result[mac_address]
    else:
        return ""
    

hardware_manuf_file_path=r"/home/kathan/ICS-Parser/Hardware_manufacturer.txt"
def check_vendor(vendor_name):
    with open(hardware_manuf_file_path, 'r') as file:
        for line in file:
            if vendor_name.upper() in line.strip().upper():
                return "OT"
    return "OTHERS"

def get_src_type(pkt):
    src_vendor=get_vendor_from_file(pkt.eth.src)
    #print(src_vendor)
    return check_vendor(src_vendor)
def get_dst_type(pkt):
    dst_vendor=get_vendor_from_file(pkt.eth.dst)
    #print(dst_vendor)
    return check_vendor(dst_vendor)


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
                            'http','telnet','ftp','dns','mdns','nbns','dnp3','goose','tcp','udp','ecat','dhcpv6','snmp','https','browser','mqtt','icmp','nmea0183','mewtocol','panasonic_discovery','cdp','pn_dcp']

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
    if 'arp' in pkt and pkt.layers[1].layer_name=="arp" : # we have to pass because there is no port involved during arp
        return "-", "-"
    elif 'lldp' in pkt and pkt.layers[1].layer_name=="lldp":
        return "-", "-"
    elif 'cdp' in pkt and pkt.layers[2].layer_name=="cdp":
        return "-", "-"
    elif 'pn_dcp' in pkt and pkt.layers[2].layer_name=="pn_dcp":
        return "-", "-"
    elif 'tcp' in pkt and pkt.layers[2].layer_name=="tcp" :
        return str(pkt.layers[2].srcport), str(pkt.layers[2].dstport)
    elif 'udp' in pkt and pkt.layers[2].layer_name=="udp":
        return str(pkt.layers[2].srcport), str(pkt.layers[2].dstport)
    else: 
        return "-", "-"

def driver_function():
    try:

        final_dict={}
        summary=[]
        network_summary={}
        network_graph = nx.Graph()

        for pkt in cap:    
            s_ip,d_ip=get_ip(pkt)
            port=get_port(pkt)
            s_port,d_port=port
            #print(port)
            protocol = get_transport_protocol(pkt)
            length=int(pkt.frame_info.len)
            key=f'{s_ip} to {d_ip}'
            higher_protocols=get_higher_layer_protocol(pkt).strip()
            set1=set(higher_protocols.split())
            
            if key not in network_summary:
                network_summary[key]={
                "Device_A":s_ip,
                "Device_B":d_ip,
                "Device_A_Type":get_src_type(pkt),
                "Device_B_Type":get_dst_type(pkt),
                "First_Seen_Date":pkt.frame_info.time,
                "Last_Seen_Date": "",
                "Total_Bandwidth":length,
                "Protocol":protocol,
                "Higher_Layer_Protocols":set(),
                "Port":set([s_port,d_port]),
                "Conversation":[],

            }
                network_graph.add_node(s_ip, Device_Type=get_src_type(pkt))
                network_graph.add_node(d_ip, Device_Type=get_dst_type(pkt))
            else:
                network_summary[key]["Total_Bandwidth"] = network_summary[key]["Total_Bandwidth"]+length
                network_summary[key]["Port"].add(s_port)
                network_summary[key]["Port"].add(d_port)
                if set1 == network_summary[key]["Higher_Layer_Protocols"]:
                    pass
                else:
                    network_summary[key]["Higher_Layer_Protocols"].update(set1)
            network_summary[key]["Last_Seen_Date"] = str(datetime.fromtimestamp(float(pkt.sniff_timestamp)))
            if higher_protocols:
                if set1 == network_summary[key]["Higher_Layer_Protocols"]:
                    pass
                else:
                    network_summary[key]["Higher_Layer_Protocols"].update(set1)
            network_graph.add_edge(s_ip, d_ip)
            conver = {

                "Timestamp":get_timestamps(pkt) ,
                "Source": s_ip,
                "to": d_ip,
                "Protocol": get_transport_protocol(pkt),
                "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                "Bytes_Exchanged":length,
                "Source_Port": s_port,
                "to_Port": d_port,

            }
            #print(conver)
            network_summary[key]["Conversation"].append(conver)
            #print(network_summary)
        #json serlializable part    
        for conversation in network_summary.values():
            conversation["Higher_Layer_Protocols"] = ", ".join(conversation["Higher_Layer_Protocols"])
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
        
        my_json=json.dumps(final_dict, indent=4)

        # file_location="network.json"
        # with open(file_location, "w") as json_file:
        #     json.dump(final_dict, json_file)
        client = pymongo.MongoClient(mongodb_url)
        db = client[database_name]
        collection = db[collection_name]
        result=collection.insert_one(final_dict)
    except AttributeError:
        pass

driver_function()





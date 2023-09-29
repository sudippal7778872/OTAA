import pyshark
import json
import sys
import pymongo


get_file = sys.argv[1]
get_UserID=sys.argv[2]
if len(sys.argv) != 3:
    sys.exit(1)
    

mongodb_url = "mongodb+srv://sudip:11VaqrpNHegrc2xH@cluster0.kwt4qdm.mongodb.net/otaa?retryWrites=true&w=majority"
database_name = "otaa"
collection_name = "events"

cap=pyshark.FileCapture(get_file,keep_packets=True,display_filter='s7comm or nbns or dns or mdns')

def get_event(pkt): #for getting events
    try:
        if pkt.layers[3].layer_name=="mdns" and "963083400._teamviewer._tcp.local" in pkt.layers[3].dns_qry_name:
            return "TEAM VIEWER DETECTED"
        elif pkt.layers[3].layer_name=="mdns" and "963083400._teamviewer._tcp.local" in pkt.layers[3].dns_resp_name:
            return "TEAM VIEWER DETECTED"
        elif pkt.layers[3].layer_name=="dns" and "boot-01.net.anydesk.com" in pkt.layers[3].qry_name:
            return "ANYDESK DETECTED"
        elif pkt.layers[3].layer_name=="nbns" and "VODAFONE.WIFI<00>" in pkt.layers[3].name:
            return "VODAFONE DONGLE"
        elif pkt.layers[6].layer_name=="s7comm" and "0x1a" in pkt.s7comm.param_func:
             s1="Request Download"+" "+"["+pkt.s7comm.param_blockcontrol_filename+"]"
             return s1
        elif pkt.layers[6].layer_name=="s7comm" and "0x1b" in pkt.s7comm.param_func:
            return "Download Block"
        elif pkt.layers[6].layer_name=="s7comm" and "0x29" in pkt.s7comm.param_func:
            return "PLC STOP"
        
        else:
            pass
    except:
        pass

def get_transport_protocol(pkt): #for transport layer protocol
    return pkt.transport_layer

def get_ip(pkt):

    if pkt.layers[1].layer_name=="ip":
        return pkt.ip.src, pkt.ip.dst
    elif pkt.layers[1].layer_name=="ipv6":
        return pkt.ipv6.src, pkt.ipv6.dst
    elif pkt.layers[1].layer_name=="arp":
        return pkt.arp.src_proto_ipv4, pkt.arp.dst_proto_ipv4
    else:
        return pkt.eth.src, pkt.eth.dst

def get_port(pkt):
    if pkt.layers[1].layer_name=="arp" or pkt.layers[1].layer_name=="lldp": # we have to pass because there is no port involved during arp
        return "No Port", "No Port"
    elif pkt.layers[2].layer_name=="tcp" or pkt.layers[2].layer_name=="udp":
        return pkt.layers[2].srcport, pkt.layers[2].dstport
    else:
        pass


def get_overall_details():
    
    event_list=[]
    final_dict=[]
    for pkt in cap:
        try:
            #print("Got inside try block")
            if ("s7comm" in pkt and len(pkt.layers)==7): #check the activity for s7comm
                if len(pkt.s7comm.field_names)==23 or len(pkt.s7comm.field_names)==18 or len(pkt.s7comm.field_names)==12:
                    s_ip,d_ip=get_ip(pkt)
                    s_port,d_port=get_port(pkt)
                    length=int(pkt.frame_info.len)

                    event_dict = {
                        
                        "Timestamp":pkt.frame_info.time ,
                        "Source": s_ip,
                        "Destination": d_ip,
                        "Transport_Layer_Protocol": get_transport_protocol(pkt),
                        "Source_Port": s_port,
                        "Destination_Port": d_port,
                        "Event_Detected": get_event(pkt)
                    }
                    event_list.append(event_dict)
            
            elif ("nbns" in pkt and len(pkt.layers)==4): # for vodafone event
                #print("I entered in vodafone")
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                length=int(pkt.frame_info.len)

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt)
                }
                event_list.append(event_dict)

            elif ("dns" in pkt): #for anydesk event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                length=int(pkt.frame_info.len)

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt)
                }
                event_list.append(event_dict)
            elif ("mdns" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                length=int(pkt.frame_info.len)

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt)
                }
                event_list.append(event_dict)
        except:
            pass
    check_parameter="Event_Detected"
    filtered_event_list=filtered_list = [d for d in event_list if d.get(check_parameter) is not None]
    #final_dict={"UserID": get_UserID}
    #final_dict["events"]=filtered_event_list

    my_json=json.dumps(final_dict, indent=4)
    #print(my_json)
    #file_location="events.json"
    #with open(file_location, "w") as json_file:
    #    json.dump(final_dict, json_file)

    user_data = {
        "UserID": get_UserID,
        "events": filtered_event_list,
    }

    client = pymongo.MongoClient(mongodb_url)
    db = client[database_name]
    collection = db[collection_name]
    result=collection.insert_one(user_data)
    print(f"Inserted document with ID: {result.inserted_id}")

get_overall_details()
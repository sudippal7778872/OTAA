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

def get_event(pkt,check_arr): #for getting events
    try:
        if 'mdns' in pkt:
            if 'dns_qry_name' in check_arr:
                return "TEAM VIEWER DETECTED"
            elif 'dns_resp_name' in check_arr:
                return "TEAM VIEWER DETECTED"
        elif 'dns' in pkt:
            if 'qry_name' in check_arr:
                return "ANYDESK DETECTED"
        elif 'nbns' in pkt:
            if 'name' in check_arr:
                return "VODAFONE DONGLE"
        elif 's7comm' in pkt:
            # print("Entered in s7comm")
            if 'param_func' in check_arr:
                if "0x1a" in pkt.s7comm.param_func:
                    if 'param_blockcontrol_filename' in check_arr:
                        return "Request Download"+" "+"["+pkt.s7comm.param_blockcontrol_filename+"]"
                    else:
                        return "Request Download"
                elif "0x1b" in pkt.s7comm.param_func:
                    return "Download Block"
                elif "0x29" in pkt.s7comm.param_func:
                    return "PLC STOP"
                elif "0x1e" in pkt.s7comm.param_func:
                    return "Code Upload"
                elif "0x1f" in pkt.s7comm.param_func:
                    return "Code Upload Ended"
                elif "0x1d" in pkt.s7comm.param_func:
                    return "Code Upload Started"
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
        return "-","-"


def get_overall_details():
    
    event_list=[]
    # final_dict=[]
    for pkt in cap:
        try:
            if ('s7comm' in pkt): #check the activity for s7comm
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.s7comm.field_names
                # length=int(pkt.frame_info.len)

                event_dict = {
                        
                        "Timestamp":pkt.frame_info.time ,
                        "Source": s_ip,
                        "Destination": d_ip,
                        "Transport_Layer_Protocol": get_transport_protocol(pkt),
                        "Source_Port": s_port,
                        "Destination_Port": d_port,
                        "Event_Detected": get_event(pkt,check_arr)
                    }
                event_list.append(event_dict)
            elif ("nbns" in pkt and len(pkt.layers)==4): # for vodafone event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.nbns.field_names
                # length=int(pkt.frame_info.len)

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)

            elif ("dns" in pkt): #for anydesk event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.dns.field_names
                # length=int(pkt.frame_info.len)

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
            elif ("mdns" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.mdns.field_names
                # length=int(pkt.frame_info.len)

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
        except:
            pass
    check_parameter="Event_Detected"
    filtered_event_list = [d for d in event_list if d.get(check_parameter) is not None]
    # final_dict={"UserID": get_UserID}
    # final_dict["events"]=filtered_event_list

    # my_json=json.dumps(final_dict, indent=4)
    # print(my_json)
    # file_location="events.json"
    # with open(file_location, "w") as json_file:
    #    json.dump(final_dict, json_file)

    user_data = {
        "UserID": get_UserID,
        "events": filtered_event_list,
        
    }
    client = pymongo.MongoClient(mongodb_url)
    db = client[database_name]
    collection = db[collection_name]
    result=collection.insert_one(user_data)
    print(user_data)
    print(f"Inserted document with ID: {result.inserted_id}")

get_overall_details()
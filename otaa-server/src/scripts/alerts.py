import pyshark
import json

cap=pyshark.FileCapture(r"C:\Users\User\OneDrive\Desktop\OT Project\ICS-Parser-main\ICS-Parser-main\pcaps\output.pcap",keep_packets=True,display_filter='s7comm or nbns or dns')

def get_event(pkt): #for getting events
    try:
        if pkt.layers[3].layer_name=="dns" and "boot-01.net.anydesk.com" in pkt.layers[3].qry_name:
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
    
    list_1=[]
    summary=[]
    for pkt in cap:
        try:
            #print("Got inside try block")
            if ("s7comm" in pkt and len(pkt.layers)==7): #check the activity for s7comm
                if len(pkt.s7comm.field_names)==23 or len(pkt.s7comm.field_names)==18 or len(pkt.s7comm.field_names)==12:
                    s_ip,d_ip=get_ip(pkt)
                    s_port,d_port=get_port(pkt)
                    length=int(pkt.frame_info.len)

                    dict_2 = {
                        
                        "Timestamp":pkt.frame_info.time ,
                        "Source": s_ip,
                        "Destination": d_ip,
                        "Transport_Layer_Protocol": get_transport_protocol(pkt),
                        "Source_Port": s_port,
                        "Destination_Port": d_port,
                        "Event_Detected": get_event(pkt)
                    }
                    list_1.append(dict_2)
            
            elif ("nbns" in pkt and len(pkt.layers)==4): # for vodafone event
                #print("I entered in vodafone")
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                length=int(pkt.frame_info.len)

                dict_2 = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt)
                }
                list_1.append(dict_2)

            elif ("dns" in pkt): #for anydesk event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                length=int(pkt.frame_info.len)

                dict_2 = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt)
                }
                list_1.append(dict_2)
        except:
            pass
    
    my_json=json.dumps(str(list_1))
    file_path=r"C:\\Users\\User\\OneDrive\\Desktop\\OT Project\\events_1.json"
    with open(file_path,"w") as json_file:
        json.dump(list_1,json_file)

    #reading json data
    file_path =r"C:\\Users\\User\\OneDrive\\Desktop\\OT Project\\events_1.json"
    with open(file_path) as json_file:
        parsed_data = json.load(json_file)

    # Print the JSON data in a presentable format
    presentable_data = json.dumps(parsed_data, indent=4, sort_keys=True)
    print(presentable_data)

get_overall_details()
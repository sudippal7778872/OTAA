import pyshark
import json
import sys
import pymongo
import hashlib

get_file = sys.argv[1]
get_UserID=sys.argv[2]
if len(sys.argv) != 3:
    sys.exit(1)
    

mongodb_url = "mongodb+srv://sudip:11VaqrpNHegrc2xH@cluster0.kwt4qdm.mongodb.net/otaa?retryWrites=true&w=majority"
database_name = "otaa"
collection_name = "events"

cap=pyshark.FileCapture(get_file,keep_packets=True,display_filter='s7comm or nbns or dns or mdns or mqtt or ftp or cip or mms or modbus')

def is_cleartext(password):
    common_hashes = ['md5', 'sha1', 'sha256', 'sha512']
    flag=0
    for hash_algorithm in common_hashes:
        if len(password) == hashlib.new(hash_algorithm).digest_size * 2:
            flag=1  
    if flag==0:
        return password

def get_event(pkt,check_arr): #for getting events
    try:
        if 'modbus' in pkt:
            if 'func_code' in pkt.modbus.field_names:
                if pkt.modbus.func_code=='3':
                    return "MODBUS Read Holding Resisters"
                elif pkt.modbus.func_code=='1':
                    return "MODBUS Read Coils"
                elif pkt.modbus.func_code=='5':
                    hex_number=pkt.modbus.data
                    hex_without_colon=hex_number.replace(":","")
                    decoded_number=int(hex_without_colon,16)
                    boolean_string=bool(decoded_number)
                    if boolean_string==True:
                        boolean_number=1
                    else:
                        boolean_number=0
                    hex_reference_num=pkt.modbus.reference_num
                    hex_without_colon=hex_reference_num.replace(":","")
                    decoded_reference_num=int(hex_without_colon,16)
                    return "MODBUS Write Single Coil ( Data - " + str(boolean_number) +" )" + "( Address - " + str(decoded_reference_num+1) + " )"
                elif pkt.modbus.func_code=='6':
                    hex_number=pkt.modbus.data
                    hex_without_colon=hex_number.replace(":","")
                    decoded_number=int(hex_without_colon,16)
                    hex_reference_num=pkt.modbus.reference_num
                    hex_without_colon=hex_reference_num.replace(":","")
                    decoded_reference_num=int(hex_without_colon,16)
                    return "MODBUS Write Single Register" + " ( Data - " + str(decoded_number) + " )" + "( Address - " + str(decoded_reference_num+1) + " )"
        elif 'cip' in pkt:
            if 'service' in check_arr:
                if pkt.cip.service=='0x06':
                    return "Rockwell PLC Start [" + str(pkt.cip.service)+"]"
                elif pkt.cip.service=='0x07':
                    return "Rockwell PLC Stop [" + str(pkt.cip.service)+"]"
        elif 'mqtt' in pkt:
            if 'hdrflags' in check_arr:
                if pkt.mqtt.hdrflags=="0x10":
                    password=pkt.mqtt.passwd
                    return "Connect request initiated with cleartext password " +is_cleartext(password)
                elif pkt.mqtt.hdrflags=="0x82":
                    return "Subscribe request initiated ["+pkt.mqtt.topic+"]"
                elif pkt.mqtt.hdrflags=="0x30":
                    hex_msg=pkt.mqtt.msg
                    hex_bytes = bytes.fromhex(hex_msg.replace(":",""))
                    decoded_string = hex_bytes.decode('utf-8')
                    return "Publish request initiated ["+decoded_string+"]"
                elif pkt.mqtt.hdrflags=="0xa2":
                    return "Unsubscribe request initiated ["+pkt.mqtt.topic+"]"
        elif 'mdns' in pkt:
            if 'dns_qry_name' in check_arr:
                if "teamviewer" in pkt.mdns.dns_qry_name:
                    return "TEAM VIEWER DETECTED"
            elif 'dns_resp_name' in check_arr:
                if "teamviewer" in pkt.mdns.dns_qry_name:
                    return "TEAM VIEWER DETECTED"
        elif 'dns' in pkt:
            if 'qry_name' in check_arr:
                if "anydesk" in pkt.dns.qry_name:
                    return "ANYDESK DETECTED"
        elif 'nbns' in pkt:
            if 'name' in check_arr:
                if "VODAFONE" in pkt.nbns.name:
                    return "VODAFONE DONGLE"
        elif 's7comm' in pkt:
            # print("Entered in s7comm")
            if 'param_func' in check_arr:
                if "0x1a" in pkt.s7comm.param_func:
                    if 'param_blockcontrol_filename' in check_arr:
                        return "SIEMENS Request Download"+" "+"["+pkt.s7comm.param_blockcontrol_filename+"]"
                    else:
                        return "SIEMENS Request Download"
                elif "0x1b" in pkt.s7comm.param_func:
                    return "SIEMENS Download Block"
                elif "0x29" in pkt.s7comm.param_func:
                    return "SIEMENS PLC STOP"
                elif "0x1e" in pkt.s7comm.param_func:
                    return "SIEMENS Code Upload"
                elif "0x1f" in pkt.s7comm.param_func:
                    return "SIEMENS Code Upload Ended"
                elif "0x1d" in pkt.s7comm.param_func:
                    return "SIEMENS Code Upload Started"
        elif 'ftp' in pkt:
            if 'request' in pkt.ftp.field_names:
                if pkt.ftp.request=="1":
                    if pkt.ftp.request_command=="PASS":
                        return "Cleartext Password detected - "+pkt.ftp.request_arg
        elif 'mms' in pkt:
            if 'confirmedservicerequest' in pkt.mms.field_names:
                if pkt.mms.confirmedservicerequest=='26':
                    return "ABB Download Sequence Initiated"
        else:
            pass
    except:
        pass

def get_transport_protocol(pkt): #for transport layer protocol
    return pkt.transport_layer

def get_higher_layer_protocol(pkt): # for OT/IT protocols
    try:
        x=""
        common_protocol=['s7comm','cotp','enip','cip','omron','bacnet','modbus','mms','lldp','arp','cdp','ssdp',
                            'http','telnet','ftp','dns','mdns','nbns','dnp3','goose','tcp','udp','ecat','dhcpv6','snmp','https','mqtt']

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
        return "-", "-"
    elif pkt.layers[2].layer_name=="tcp" or pkt.layers[2].layer_name=="udp":
        return pkt.layers[2].srcport, pkt.layers[2].dstport
    else:
        return "-","-"


def get_overall_details():
    
    event_list=[]
    # final_dict=[]
    for pkt in cap:
        try:
            higher_protocols=get_higher_layer_protocol(pkt)
            if ('s7comm' in pkt): #check the activity for s7comm
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.s7comm.field_names
               

                event_dict = {
                        
                        "Timestamp":pkt.frame_info.time ,
                        "Source": s_ip,
                        "Destination": d_ip,
                        "Transport_Layer_Protocol": get_transport_protocol(pkt),
                        "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                        "Source_Port": s_port,
                        "Destination_Port": d_port,
                        "Event_Detected": get_event(pkt,check_arr)
                    }
                event_list.append(event_dict)
            elif ("nbns" in pkt and len(pkt.layers)==4): # for vodafone event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.nbns.field_names
                

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)

            elif ("dns" in pkt): #for anydesk event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.dns.field_names
               

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
            elif ("mdns" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.mdns.field_names
               

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
            elif ("mqtt" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.mqtt.field_names
                

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
            elif ("ftp" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.ftp.field_names
            

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
            elif ("cip" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.cip.field_names

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
            elif ("mms" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.mms.field_names

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
            elif ("modbus" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.modbus.field_names

                event_dict = {
                    
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": get_event(pkt,check_arr)
                }
                event_list.append(event_dict)
        except:
            pass
    check_parameter="Event_Detected"
    filtered_event_list = [d for d in event_list if d.get(check_parameter) is not None]

    user_data = {
        "UserID": get_UserID,
        "events": filtered_event_list,
        
    }
    # file_location="events.json"
    # with open(file_location, "w") as json_file:
    #    json.dump(user_data, json_file)
    client = pymongo.MongoClient(mongodb_url)
    db = client[database_name]
    collection = db[collection_name]
    result=collection.insert_one(user_data)
    # print(user_data)
    # print(f"Inserted document with ID: {result.inserted_id}")

get_overall_details()
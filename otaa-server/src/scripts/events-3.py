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

cap=pyshark.FileCapture(get_file,keep_packets=True,display_filter='s7comm or nbns or dns or mdns or mqtt or ftp or cip or mms or modbus or nmea0183 or mewtocol or panasonic_discovery or http or dnp3 or omron')

def is_cleartext(password):
    common_hashes = ['md5', 'sha1', 'sha256', 'sha512']
    flag=0
    for hash_algorithm in common_hashes:
        if len(password) == hashlib.new(hash_algorithm).digest_size * 2:
            flag=1  
    if flag==0:
        return password
previous_data_Navigation=None
def get_maritime_event(pkt):
    global previous_data_Navigation
    nmea_layer=str(pkt.nmea0183)
    nmea_layer=nmea_layer.split()
    filtered_array = [item for item in nmea_layer if '\x1b' not in item]
    filtered_array=filtered_array[16:]
    if 'GPRMC' in nmea_layer:
        #print(filtered_array)
        if len(filtered_array)<11:
            return "Unstructured Data of GPRMC"

        latitude = filtered_array[2]  # Latitude
        lat_direction = filtered_array[3]  # Latitude direction (N or S)
        longitude = filtered_array[4]  # Longitude
        lon_direction = filtered_array[5]  # Longitude direction (E or W)
        speed_over_ground = float(filtered_array[6])  # Speed over ground
        course_over_ground = filtered_array[7]  # Course over ground
        date_utc = filtered_array[8]  # Date in UTC
        magnetic_variation = filtered_array[9]  # Magnetic variation
        mag_var_direction = filtered_array[10]  # Magnetic variation direction (E or W)

        if previous_data_Navigation is None:
            previous_data_Navigation = {
                'latitude_direction': lat_direction,
                'longitude_direction': lon_direction,
                'mag_var_direction': mag_var_direction,
                'speed_over_ground':speed_over_ground
            }
            return "Navigation/Speed Over Ground Detected: "+"Latitude: "+str(latitude)+" , Latitude_Direction: "+str(lat_direction)+" , Longitude: "+str(longitude)+" , Longitude_Direction: "+str(lon_direction)+" , Speed_Over_Ground: "+str(speed_over_ground)+" , Course_Over_Ground: "+str(course_over_ground)+" , UTC_Date: "+str(date_utc)+" , Magnetic_Variation: "+str(magnetic_variation)+" , Magnetic_Direction: "+str(mag_var_direction)
        else:
            if previous_data_Navigation['latitude_direction'] != lat_direction or \
            previous_data_Navigation['longitude_direction'] != lon_direction or \
            previous_data_Navigation['mag_var_direction'] != mag_var_direction or \
            previous_data_Navigation['speed_over_ground']!=speed_over_ground:
                
                # Update previous_data_Navigation
                previous_data_Navigation['latitude_direction'] = lat_direction
                previous_data_Navigation['longitude_direction'] = lon_direction
                previous_data_Navigation['mag_var_direction'] = mag_var_direction
                previous_data_Navigation['speed_over_ground'] = speed_over_ground

                return "Change in Navigation/Speed Over Ground Detected: "+"Latitude: "+str(latitude)+" , Latitude_Direction: "+str(lat_direction)+" , Longitude: "+str(longitude)+" , Longitude_Direction: "+str(lon_direction)+" , Speed_Over_Ground: "+str(speed_over_ground)+" , Course_Over_Ground: "+str(course_over_ground)+" , UTC_Date: "+str(date_utc)+" , Magnetic_Variation: "+str(magnetic_variation)+" , Magnetic_Direction: "+str(mag_var_direction)
    else:
        return None

def get_mewtocol_event(pkt):
    if 'panasonic_payload_firmware' in pkt.mewtocol.field_names:
        if str(pkt.mewtocol.panasonic_payload_operation) == '0x0001':
            return "Panasonic PLC Run"
        elif str(pkt.mewtocol.panasonic_payload_operation) == '0x0000':
            return "Panasonic PLC Program"

cpu = []
def get_panasonic_discovery_event(cpuname):
    cpu.append(cpuname)
    #print(cpu)
    if len(cpu)==1:
        return 0,0
    else:
        if cpu[len(cpu)-1]==cpu[len(cpu)-2]:
            return 0,0
        else:
            return cpu[len(cpu)-1],cpu[len(cpu)-2]  

def get_event(pkt,check_arr): #for getting events
    try:
        if 'omron' in pkt:
            if 'command' in pkt.omron.field_names and 'response_code' in pkt.omron.field_names:
                if str(pkt.omron.command) == "0x0101":
                    return "OMRON Memory Area Read detected"
                elif str(pkt.omron.command) == "0x0501":
                    return "OMRON Controller Data Read detected"
        elif 'dnp3' in pkt:
            if 'al_func' in pkt.dnp3.field_names:
                if str(pkt.dnp3.al_func)=="2":
                    if 'al_timestamp' in pkt.dnp3.field_names:
                        return "DNP3 Write Code at " + str(pkt.dnp3.al_timestamp)
                    else:
                        return "DNP3 Write Code"
                elif str(pkt.dnp3.al_func)=="13":
                    return "DNP3 PLC Cold Start"
                elif str(pkt.dnp3.al_func)=="14":
                    return "DNP3 PLC Warm Start"
        elif 'panasonic_discovery' in pkt:
            if 'payload_cpuname' in pkt.panasonic_discovery.field_names:
                cpuname1, cpuname2  = get_panasonic_discovery_event(str(pkt.panasonic_discovery.payload_cpuname))
                if cpuname1 != cpuname2:
                    return "CPU Name Changed from {} to {}".format(cpuname2,cpuname1)
        elif 'modbus' in pkt:
            if 'func_code' in pkt.modbus.field_names:
                if pkt.modbus.func_code=='3':
                    return "MODBUS Read Holding Registers"
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
                    elif pkt.ftp.request_command=="USER":
                        return "Username detected - "+pkt.ftp.request_arg
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
                            'http','telnet','ftp','dns','mdns','nbns','dnp3','goose','tcp','udp','ecat','dhcpv6','snmp','https','mqtt','nmea0183','mewtocol','panasonic_discovery','dnp3']

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

def get_event_id(event):
    event_id_mapping = {
        "OMRON Memory Area Read detected" : "SHEID1000",
        "OMRON Controller Data Read detected" :  "SHEID1001",
        "DNP3 Write Code at " : "SHEID1002",
        "DNP3 Write Code" : "SHEID1003",
        "DNP3 PLC Cold Start" : "SHEID1004",
        "DNP3 PLC Warm Start" : "SHEID1005",
        "CPU Name Changed from" : "SHEID1006",
        "MODBUS Read Holding Registers" : "SHEID1007",
        "MODBUS Read Coils" : "SHEID1008",
        "MODBUS Write Single Coil" : "SHEID1009",
        "MODBUS Write Single Register" : "SHEID1010",
        "Rockwell PLC Start" : "SHEID1011",
        "Rockwell PLC Stop" : "SHEID1012",
        "Connect request initiated with cleartext password" : "SHEID1013",
        "Subscribe request initiated" : "SHEID1014",
        "Publish request initiated" : "SHEID1015",
        "Unsubscribe request initiated" : "SHEID1016",
        "TEAM VIEWER DETECTED" : "SHEID1017",
        "ANYDESK DETECTED" : "SHEID1018",
        "VODAFONE DONGLE" : "SHEID1019",
        "SIEMENS Request Download" : "SHEID1020",
        "SIEMENS Download Block" : "SHEID1021",
        "SIEMENS PLC STOP" : "SHEID1022",
        "SIEMENS Code Upload" : "SHEID1023",
        "SIEMENS Code Upload Ended" : "SHEID1024",
        "SIEMENS Code Upload Started" : "SHEID1025",
        "Cleartext Password detected" : "SHEID1026",
        "Username detected" : "SHEID1027",
        "ABB Download Sequence Initiated" : "SHEID1028",
        "Panasonic PLC Run" :  "SHEID1029",
        "Panasonic PLC Program" : "SHEID1030",
        "Navigation/Speed Over Ground Detected" : "SHEID1031",
        "Change in Navigation/Speed Over Ground Detected" : "SHEID1032"
    }
    for event_id in event_id_mapping:
        if event_id in event:
            return event_id_mapping[event_id]

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
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)

                event_dict = {
                        "Event_ID" : event_id,
                        "Timestamp":pkt.frame_info.time ,
                        "Source": s_ip,
                        "Destination": d_ip,
                        "Mac":pkt.eth.src,
                        "Transport_Layer_Protocol": get_transport_protocol(pkt),
                        "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                        "Source_Port": s_port,
                        "Destination_Port": d_port,
                        "Event_Detected": event
                    }
                event_list.append(event_dict)
            elif ("nbns" in pkt and len(pkt.layers)==4): # for vodafone event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.nbns.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)

                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)

            elif ("dns" in pkt): #for anydesk event
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.dns.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)

                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("mdns" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.mdns.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)

                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("mqtt" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.mqtt.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)

                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("ftp" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.ftp.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)

                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("cip" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.cip.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("mms" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.mms.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("modbus" in pkt):
                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.modbus.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","") ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("nmea0183" in pkt):

                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.nmea0183.field_names
                event = get_maritime_event(pkt)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","").strip() ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("mewtocol" in pkt):

                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                event = get_mewtocol_event(pkt)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","").strip() ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("panasonic_discovery" in pkt):

                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.panasonic_discovery.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","").strip() ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
                #print(event_list)
            elif ("http" in pkt):

                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.http.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","").strip() ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
                #print(event_list)
            elif ("dnp3" in pkt):

                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.dnp3.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","").strip() ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
                }
                event_list.append(event_dict)
            elif ("omron" in pkt):

                s_ip,d_ip=get_ip(pkt)
                s_port,d_port=get_port(pkt)
                check_arr=pkt.omron.field_names
                event = get_event(pkt,check_arr)
                event_id = get_event_id(event)
                event_dict = {
                    "Event_ID" : event_id,
                    "Timestamp":pkt.frame_info.time ,
                    "Source": s_ip,
                    "Destination": d_ip,
                    "Mac":pkt.eth.src,
                    "Transport_Layer_Protocol": get_transport_protocol(pkt),
                    "Higher_Layer_Protocols":higher_protocols.replace("tcp","").replace("udp","").strip() ,
                    "Source_Port": s_port,
                    "Destination_Port": d_port,
                    "Event_Detected": event
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
    print(user_data)
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
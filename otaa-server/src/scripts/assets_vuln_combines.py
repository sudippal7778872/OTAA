import pyshark
import sys
import os
import argparse
import concurrent.futures
import re
import xml.etree.ElementTree as ET
import subprocess
import json
import pymongo

vul_asset_list=[]
no_vul_found={} 
get_file = sys.argv[1]
get_UserID=sys.argv[2]
if len(sys.argv) != 3:
    sys.exit(1)
#*******************************vulneraability-part****************************************************************
vendor_mapping = {"Rockwell Automation/Allen-Bradley (0x0001)":"Rockwell",'Siemens': 'Siemens', 'Siemens AG': 'Siemens', 'Original Siemens Equipment': 'Siemens', 
                  'Schneider Electric': 'Schneider Electric', 'Samsung': 'Samsung', 'Asus': 'Asus', 
                  'Mitsubishi Electric': 'Mitsubishi Electric', 'Emerson': 'Emerson', 'Red Lion Controls': 'Red Lion', 
                  'Phoenix Contact GmbH & Co. KG': 'Phoenix Contact', 'Moxa': 'Moxa', 
                  'Rockwell Automation/Allen-Bradley': 'Rockwell Automation', 'Phoenix Contact': 'Phoenix Contact', 
                  'ABB': 'ABB', 'Fuji Electric Co, Ltd': 'Fuji Electric', 'B&R Industrial Automation GmbH': 'B&R', 
                  'PROFace': 'Schneider Electric', 'Unitronics LTD': 'Unitronics', 'VIPA Controls America': 'VIPA Controls', 
                  'General Electric': 'General Electric', 'SIEMENS AG': 'Siemens', 'Ewon': 'HMS Networks', 'Advantech': 'Weintek', 
                  'Prosoft Technology': 'ProSoft Technology', 'Yamaha': 'Yamaha', 'Yamaha Corporation': 'Yamaha', 
                  'Delta Electronics, Inc.': 'Delta Electronics', 'Eaton Corporation plc': 'Eaton', 
                  'Honeywell International Inc.': 'Honeywell', 'JTEKT CORPORATION': 'JTEKT', 
                  'WAGO Kontakttechnik GmbH & Co. KG': 'WAGO', 'Banner Engineering Corp': 'Banner', 
                  'Distech Controls Inc.': 'Distech', 'Black Box': 'Black Box', 'Beckhoff Automation GmbH & Co. KG': 'Beckhoff', 
                  'Schneider Automation': 'Schneider Electric', 'Mitsubishi': 'Mitsubishi Electric', 
                  'OMRON': 'Omron', 'Solace Systems': 'Solace', 'AutomationDirect.com': 'AutomationDirect', 
                  'Belden Deutschland Gmbh': 'Belden', 'Cisco Systems, Inc.': 'Cisco Systems', 'CIMON Inc.': 'CIMON', 
                  'Barix.com.': 'Barix', 'Automated Logic Corporation': 'Automated Logic', 'Bosch Rexroth': 'Bosch Rexroth', 
                  'IDEC Corporation': 'IDEC', 'TridiumEMEA': 'Tridium', 'Kaiterra': 'Kaiterra', 'Advantech(APAX)': 'Advantech', 
                  'Festo Inc': 'Festo', 'Algo': 'Algo', 'Atlas Copco AB': 'Atlas Copco', 'Fr. Sauter AG': 'Sauter Control', 
                  'INVT Auto-Control Technology Co Ltd.': 'INVT Electric', 'SEL': 'SEL', 'Murrelektronik GmbH': 'Murrelektronik', 
                  'Johnson Controls': 'Johnson Controls', 'Schmersal, Inc': 'Schmersal', 'Murr Elektronik GmbH': 'Murr', 
                  'GE Fanuc Automation': 'Emerson', 'Lantronix Inc': 'Lantronix', 'Teledyne DALSA': 'Teledyne', 
                  'Honeywell': 'Honeywell', 'Danfoss': 'Danfoss', 'Reolink': 'Reolink', 'Balluff Automation India Pvt. Ltd.': 'Balluff', 
                  'Bernecker_+_Rainer__Industrie-Elektronik': 'B&R', 'Bernecker + Rainer  Industrie-Elektronik': 'B&R', 
                  'Bernecker_+_Rainer_Industrie-Elektronik': 'B&R', 'Razberi Technologies, Inc.': 'Razberi', 
                  'Bernecker + Rainer Industrie-Elektronik': 'B&R', 'SMC Corporation': 'SMC Corporation', 
                  'Zebra Technologies Corp': 'Zebra', 'Cognex Corporation': 'Cognex', 'Razberi_Technologies,_Inc.': 'Razberi', 
                  'CINCOZE': 'Cincoze', 'FORSIS GmbH': 'FORSIS', 'Schweitzer Engineering Laboratories Inc.': 'Schweitzer', 
                  'ProSoft Technology': 'ProSoft Technology', 'Horner Automation': 'Horner', 'OT Protocol: BACnet': 'Samsung', 
                  'Keyence Corporation': 'KEYENCE CORPORATION', 'Rockwell_Automation/Allen-Bradley': 'Rockwell Automation', 
                  'Comtronix': 'Comtronix', 'Avigilon': 'Avigilon', 'Opto 22': 'Opto 22', 'opto22': 'Opto 22', 
                  'SEW-EURODRIVE Gmbh': 'Murr', 'Generic_Android': 'Huawei', 'Teguar': 'Teguar', 'AAEON': 'AAEON', 
                  'Compulab Ltd.': 'CompuLab', 'Compulab_Ltd.': 'CompuLab', 'Axiomtek Co., Ltd.': 'Axiomtek', 
                  'Axiomtek_Co.,_Ltd.': 'Axiomtek', 'OT Protocol: CIP,Ethernet IP': 'Rockwell Automation', 
                  'OT Protocol: Ethernet IP': 'Rockwell Automation', 'Now_Micro': 'NOW Micro', 'Now Micro': 'NOW Micro', 
                  'OT Protocol: BACnet,Ethernet IP': 'Amcrest', 'OT Protocol: Fins,BACnet': 'Amcrest', 
                  'Allen Bradley': 'Rockwell Automation', 'Wincomm': 'Wincomm', 'Mercury Security': 'HID Global', 
                  'AOPEN': 'AOPEN', 'Christ_Electronic_Systems_GmbH': 'Christ', 'Christ Electronic Systems GmbH': 'Christ', 
                  'IBASE_Technology': 'IBASE Technology', 'IBASE Technology': 'IBASE Technology', 'AOPEN Inc.': 'AOPEN', 
                  'AOPEN_Inc.': 'AOPEN', 'Schweitzer Engineering Laboratories, Inc.': 'SEL', 'AXIS': 'Axis Communications', 
                  'Apple': 'Apple', 'Real Time Automation, Inc.': 'Real Time Automation', 'Beckhoff_Automation_GmbH_&_Co._KG': 'Beckhoff', 
                  'SIEMENS_AG': 'Siemens', 'HP': 'Teguar', 'Mitsubishi Electric Corporation': 'Mitsubishi', 'OnLogic': 'OnLogic', 
                  'Pelco by Schneider Electric': 'Pelco', 'Pelco_by_Schneider_Electric': 'Pelco', 'Neousys Technology Inc.': 'Neousys', 
                  'Advanced Micro Controls Inc. (AMCI)': 'AMCI', 'Rockwell Automation': 'Rockwell Automation', 'Dnp3': 'Rockwell Automation', 
                  'OT Protocol: S7': 'Siemens', 'OT Protocol: PCCC,CIP,Ethernet IP': 'Rockwell Automation', 
                  'OT Protocol: Melsoft': 'Mitsubishi Electric', 'Quanmax Inc.': 'Quanmax', 'Sonos': 'Sonos', 
                  'Intel(R) Client Systems': 'NOW Micro', 'Yokogawa Electric': 'Yokogawa', 
                  'Siemens Schweiz AG (Formerly: Landis & Staefa Division Europe)': 'Siemens', 
                  'OTÂ\xa0Protocol: Fins': 'Omron', 'Extron': 'Extron', 'OT Protocol: Fins': 'Extron', 
                  'OT Protocol: Metasys Private Message': 'Extron', 'OT Protocol: Metasys Private Message,Fins': 'Extron', 
                  'National Instruments': 'National Instruments', 'HIKVISION': 'Hikvision', 'Hikvision.China': 'Hikvision', 
                  'Stealth.com': 'Stealth.com', 'Stealth.Com': 'Stealth.com', 'STX Technology': 'STX', 'STX_Technology': 'STX', 
                  'Phoenix_Contact': 'Phoenix Contact', 'Phoenix Controls Corporation': 'Honeywell', 
                  'OT Protocol: HoneywellControlEdgeBuilder': 'Honeywell', 'OT Protocol: HoneywellControlEdgeDiscovery': 'Honeywell', 
                  'OT Protocol: HoneywellControlEdgeDiscovery,HoneywellControlEdgeBuilder': 'Honeywell', 'Alerton / Honeywell': 'Honeywell', 
                  'D-Link': 'D-Link', 'Barco_NV': 'Barco', 'Barco NV': 'Barco', 'AAEON Technology Inc.': 'AAEON', 'ads-tec': 'ads-tec', 
                  'FORSIS_GmbH': 'FORSIS', 'OT Protocol: MQTT': 'Biamp', 'InHand Networks': 'InHand Networks', 
                  'Schneider Electric Systems USA, Inc.': 'Schneider', 'Omron': 'Omron', 'Cisco': 'Cisco Systems', 'ICP/iEi': 'ICP Deutschland', 
                  'SKIDATA AG': 'SKIDATA', 'Stratus': 'Stratus', 'ADLINK TECHNOLOGY Inc.': 'ADLINK', 'ADLINK_TECHNOLOGY_Inc.': 'ADLINK', 
                  'Pheonix Contact': 'Phoenix Contact', 'Advantech Co., Ltd.': 'Advantech', 'Cisco Systems': 'Cisco Systems', 
                  'Neousys_Technology_Inc.': 'Neousys', 'Weintek Labs, Inc': 'Weintek', 'Microcyber Inc.': 'Distech Controls', 
                  '2018/11/13': 'Rockwell Automation', '11/13/18': 'Rockwell Automation', '2018/06/23': 'Rockwell Automation', 
                  '2020/07/08': 'Rockwell Automation', '2020/09/29': 'Rockwell Automation', 'InFocus': 'InFocus', 
                  'ProSoft Technology, Inc.': 'ProSoft Technology', 'Winmate Inc.': 'Winmate', 'Axis Communications': 'Axis Communications', 
                  'Axis_Communications': 'Axis Communications', 'LenelS2': 'Carrier', 'OT Protocol: MMS': 'ABB', 
                  'OT Protocol: Profinet': 'Siemens', 'OT Protocol: Profinet DCE-RPC,Profinet,S7 Comm Plus': 'Siemens', 
                  'Advantech B+B SmartWorx': 'Advantech B+B SmartWorx', 'OT Protocol: Profinet,S7': 'Siemens', 
                  'Hans Turck GmbH & Co.KG': 'Truck', 'Philips': 'Philips'
                  }
def call_vulnerability(vendor,product):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    signatures_dir = os.path.join(current_dir, "Signatures")
    mapped_vendor = vendor_mapping.get(vendor, vendor)
    vendor_folder = os.path.join(signatures_dir, mapped_vendor)
    
    results = []  # List to store the results
    if mapped_vendor=="": #1
        return results
    # if product=="":
    #     return results
    if not os.path.exists(signatures_dir) or not os.path.isdir(signatures_dir):
        # no_vul_found["Report"]="Not Found"
        # results.append(no_vul_found)
        return results
    
    if not os.path.exists(vendor_folder) or not os.path.isdir(vendor_folder):
        # no_vul_found["Report"]="Not Found"
        # results.append(no_vul_found)
        return results
    
    
    for filename in os.listdir(vendor_folder):
        if not filename.endswith(".txt"):
            continue
        
        file_path = os.path.join(vendor_folder, filename)
        with open(file_path, 'r') as file:
            content = file.read()
            
            # Split the content into individual signature blocks
            signature_blocks = re.split(r"(?=#For (advisory|Advisory|https://))", content)
            
            for signature_num, signature in enumerate(signature_blocks, start=1):
                if not signature.strip():  # Skip empty blocks
                    continue
                
                product_match = re.search(rf"{re.escape(mapped_vendor)}", signature, re.IGNORECASE) #change from product to vendor for showing more vul for the time being
                if product_match:
                    pattern_matches = re.finditer(r"arg#(\d+):\s*{([^}]+)}", signature)
                    found_matching_arg = False  # Flag to track if a matching argument is found
                    for match in pattern_matches:
                        arg_num = match.group(1)
                        arg_content = match.group(2)
                        #regex_pattern = re.search(r"model\s*=\s*\"(.+?)\"", arg_content)
                        regex_pattern = re.search(r'model\s*=\s*"([^"]+)"', arg_content)

                        if regex_pattern:
                            pattern = regex_pattern.group(1)
                            advisory_links = re.findall(r"https?://\S+", signature)
                            advisory_no = ""
                            filtered_advisory_links = []
                            for link in advisory_links:
                                if "regex101.com" not in link:
                                    filtered_advisory_links.append(link)
                                    advisory_no_match = re.search(r"icsa-(\d+-\d+-\d+)", link)
                                    if advisory_no_match:
                                        advisory_no = advisory_no_match.group(1)
                            if not advisory_no:
                                title_match = re.search(r"Title:(.*)", signature)
                                title = title_match.group(1).strip() if title_match else ""
                                advisory_no_match = re.search(r"ICSA-(\d+-\d+-\d+)", title)
                                if advisory_no_match:
                                    advisory_no = advisory_no_match.group(1)
                            
                            title_match = re.search(r"Title:(.*)", signature)
                            title = title_match.group(1).strip() if title_match else ""

                            vuln_type_match = re.search(r"Type:(.*)", signature)
                            vuln_type = vuln_type_match.group(1).strip() if vuln_type_match else ""

                            manufacturer_match = re.search(r"manufacturer:(.*)", signature)
                            manufacturer = manufacturer_match.group(1).strip() if manufacturer_match else ""

                            result = {
                                "Advisory_No": f"icsa-{advisory_no}" if advisory_no else "",
                                "Advisory_Links": filtered_advisory_links,
                                "Title": title,
                                "Manufacturer": manufacturer,
                                "Type":vuln_type
                            }

                            results.append(result)

                            found_matching_arg = True  # Set the flag to True if a match is found
                            break  # Exit the loop after processing the first matching argument
                            
                    if found_matching_arg:
                        break  # Exit the outer loop after finding a matching block
    # if len(results)==0: #if there is no vuln
    #     temp_dict={}
    #     temp_dict["Report"]="No Vulnerability"
    #     results.append(temp_dict)
    return results

def call_for_vulnerability_asset(adv_no,title,vul_type,asset_mac,asset_ip,vulnerability_id):
    vulnerability={
                "Vulnerability_ID":vulnerability_id,
                "Advisory_No": adv_no,
                "Title": title,
                "Type": vul_type,
                "Asset_MAC":asset_mac,
                "Asset_IP":asset_ip
            }
    vul_asset_list.append(vulnerability)

def get_SHAID(start_id = [100000]):
#SHA100001    
    while True:
        yield f"SHA{start_id[0]}"
        start_id[0] += 1

auto_inc_start_id = get_SHAID()

def call_for_asset_vulnerability(data_list):
    data_list = [{key.replace(' ', '_'): value for key, value in item.items()} for item in data_list]
    asset_id=1
    vul_id=1
    for entry in data_list:
        entry["Asset_ID"]=next(auto_inc_start_id)
        if 'Product_Name' in entry:
            vendor_id=entry['Vendor_ID']
            product_name=entry['Product_Name']

        elif 'System_Name' in entry: #2
            vendor_id=entry['Vendor_ID']
            product_name=entry['System_Name']

        if 'Mac' in entry:
            asset_mac=entry["Mac"]
        else:
            asset_mac=""

        if 'IP' in entry:
            asset_ip=entry["IP"]
        else:
            asset_ip=""

        result=call_vulnerability(vendor_id,product_name) #list has been returned
        # result=call_vulnerability("ROCKWELL","EN2T")
        if result:
            
            entry["Vulnerability"]=result

            for vuln in result:
                if "Advisory_No" in vuln: 
                    adv_no=vuln["Advisory_No"]
                    title=vuln["Title"]
                    vul_type=vuln["Type"]
                    call_for_vulnerability_asset(adv_no,title,vul_type,asset_mac,asset_ip,vul_id)
                    vul_id=vul_id+1
        else:
            entry["Vulnerability"]=result
        asset_id=asset_id+1
    

    user_data = {
        "UserID": get_UserID,
        "assets_summary": data_list,
        "vulnerability_summary":vul_asset_list
        
    }
    print(user_data)
    # filename1="asset&vuln.json"
    # with open(filename1, 'w') as file:
    #     json.dump(user_data, file)      


    client = pymongo.MongoClient(mongodb_url)
    db = client[database_name]
    collection = db[collection_name]
    result=collection.insert_one(user_data)
    # print(f"Inserted document with ID: {result.inserted_id}")




#********************************mongodb-part**************************************************************************************
mongodb_url = "mongodb+srv://sudip:11VaqrpNHegrc2xH@cluster0.kwt4qdm.mongodb.net/otaa?retryWrites=true&w=majority"
database_name = "otaa"
collection_name = "assets"
#*******************************assets-part****************************************************************************************

filtered_cap_s7comm = pyshark.FileCapture(get_file, display_filter="s7comm.szl.xy11.0001.ausbg || s7comm.szl.001c.0001.name")
filtered_cap_enip = pyshark.FileCapture(get_file, display_filter="enip.lir.name")
filtered_cap_cip = pyshark.FileCapture(get_file, display_filter="cip.id.product_name")
filtered_cap_modbus = pyshark.FileCapture(get_file, display_filter="modbus.object_id == 1")
filtered_cap_lldp = pyshark.FileCapture(get_file, display_filter="lldp.tlv.system.desc")
filtered_cap_omron = pyshark.FileCapture(get_file, display_filter="omron", use_json=True, include_raw=True)
filtered_cap_bacnet = pyshark.FileCapture(get_file, display_filter="bacapp.application_tag_number == 7")
filtered_cap_mms = pyshark.FileCapture(get_file, display_filter="mms.vendorName")
filtered_cap_browser = pyshark.FileCapture(get_file, display_filter="browser")
filtered_cap_dhcp = pyshark.FileCapture(get_file, display_filter="dhcp") #3
filtered_cap_arp = pyshark.FileCapture(get_file, display_filter="arp")
filtered_cap_epm = pyshark.FileCapture(get_file, display_filter="epm")
filtered_cap_mewtocol = pyshark.FileCapture(get_file, display_filter="mewtocol")
filtered_cap_panasonic_discovery = pyshark.FileCapture(get_file, display_filter="panasonic_discovery")
filtered_cap_hikevision = pyshark.FileCapture(get_file)
filtered_cap_dnp3 = pyshark.FileCapture(get_file,display_filter="dnp3")
#list that store the results from functions
new_list = []
#seim_list = []
#mac_file_path = r"C:\Users\User\OneDrive\Desktop\mac-vendor-wireshark.txt"
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
    #print(mac_address)
    if mac_address in result:
        return result[mac_address]
    else:
        return ""

def process_packet_s7comm(pkt):
    #src_mac = "Mac: " + (pkt.eth.src.showname).split(" ")[1]
    device_type = "Device_Type: "+""
    source = "Source: " + " Network Packet"
    src_mac = "Mac: " + pkt.eth.src
    mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
    if("IP" in str(pkt.layers)):
        src_ip = "IP: " + pkt.ip.src
    else:
        src_ip = "IP: " + "-"
    vendor_id = "Vendor_ID: Siemens AG"
    try:
        product_name = "System_Name: " + (pkt.s7comm.szl_001c_0001_name.showname).split(":")[1].strip()
        serial_number = "Serial_Number: " + (pkt.s7comm.szl_001c_0005_serialn.showname).split(":")[1].strip()
        cpu_type = "CPU_Type: " + (pkt.s7comm.szl_001c_0007_cputypname.showname).split(":")[1].strip()
        memory_type = "Additional_Component: " + (pkt.s7comm.szl_001c_0008_snmcmmc.showname).split(":")[1].strip()
        temp_tuple = (source,device_type,src_mac, product_name, serial_number, cpu_type, memory_type,src_ip, vendor_id,mac_manuf)
        new_list.append(temp_tuple)

    except AttributeError:
        pass

    try:
        module_num = "Module_Number: " + (pkt.s7comm.szl_xy11_0001_anz.showname).split(":")[1].strip()
        major_revision = str(pkt.s7comm.szl_xy11_0001_ausbg.all_fields[2])
        hex_ausbg = int(major_revision.split(':')[1].rstrip('>').strip())
        ausbg_num = hex(hex_ausbg).lstrip('0x')[2:].lstrip("0")
        minor_revision = str(pkt.s7comm.szl_xy11_0001_ausbe.all_fields[2])
        hex_ausbe = int(minor_revision.split(':')[1].rstrip('>').strip())
        ausbe_num = hex(hex_ausbe).zfill(4).lstrip('0x')
        value = ausbe_num.zfill(4)
        result_tmp = value[:-2] + '.' + value[-2:].lstrip("0")
        if result_tmp[0] == "0":
            result = result_tmp[1:]
        else:
            result = result_tmp
        version_tmp = format(ausbg_num + "." + result)
        module_version = "Version: " + version_tmp
        temp_tuple = (source,device_type,src_mac, module_num, module_version,src_ip, vendor_id,mac_manuf)
        new_list.append(temp_tuple)
    except AttributeError:
        pass

def process_packet_enip(pkt):
    try:
        vendor_id = "Vendor_ID: " + pkt.enip.lir_vendor.showname[11:]
        source = "Source: " + " Network Packet"
        device_type = "Device_Type: " + pkt.enip.lir_devtype.showname[13:]
        product_name = "Product_Name: " + pkt.enip.lir_name.showname[14:]
        revision = "Version: " + ((pkt.enip.lir_revision.showname).split(":")[1].strip())
        serial_number = "Serial_Number: " + pkt.enip.lir_serial.showname[14:]
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        all_value = (source,vendor_id,device_type,product_name,revision,serial_number,device_ip,device_mac,mac_manuf)
        new_list.append(all_value)
    except AttributeError:
        pass

def process_packet_cip(pkt):
    try:
        vendor_id = "Vendor_ID: " + pkt.cip.id_vendor_id.showname[11:]
        source = "Source: " + " Network Packet"
        device_id = "Device_Type: " + pkt.cip.id_device_type.showname[13:]
        product_name = "Product_Name: " + pkt.cip.id_product_name.showname[14:]
        major_revision = pkt.cip.id_major_rev
        minor_revision = pkt.cip.id_minor_rev
        revision = "Version: " + major_revision +"."+ minor_revision
        serial_number = "Serial_Number: " + pkt.cip.id_serial_number.showname[14:]
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        all_value = (source,vendor_id,device_id,product_name,revision,serial_number,device_ip,device_mac,mac_manuf)
        new_list.append(all_value)
    except AttributeError:
        pass

def process_packet_cipcm(pkt):
    try:
        vendor_id = "Vendor_ID: " + pkt.cipcm.cip_id_vendor_id.showname[11:]
        source = "Source: " + " Network Packet"
        device_id = "Device_Type: " + pkt.cipcm.cip_id_device_type.showname[13:]
        product_name = "Product_Name: " + pkt.cipcm.cip_id_product_name.showname[14:]
        serial_number = "Serial_Number: " + pkt.cipcm.cip_id_serial_number.showname[14:]
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        major_revision = pkt.cipcm.cip_id_major_rev
        minor_revision = pkt.cipcm.cip_id_minor_rev
        revision = "Version: " + major_revision +"."+ minor_revision
        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        all_value = (source,vendor_id,device_id,product_name,revision,serial_number,device_ip,device_mac,mac_manuf)
        new_list.append(all_value)
    except AttributeError:
        pass

def extract_string_values(packet):
    packet_str = str(packet)
    matches = re.findall(r"Object String Value: (.*)", packet_str)
    return matches

def process_packet_modbus(pkt):
    try:
        modbus_data = pkt.modbus
        source = "Source: " + " Network Packet"
        device_type = "Device_Type: "+""
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        value = extract_string_values(modbus_data)
        if value is not None:
            temp_obj_list = []
            temp_obj_list.extend(value)
            vendor = "Vendor_ID: " + temp_obj_list[0]
            product_name = "Product_Name: " + temp_obj_list[1]
            version = "Version: " + (temp_obj_list[2])[1:]
            all_value = (source,device_type,vendor, product_name, version, device_ip, device_mac,mac_manuf)
            new_list.append(all_value)
    except AttributeError:
        pass

def process_packet_omron(pkt):
    try:
        raw_pkt = pkt.get_raw_packet()
        source = "Source: " + " Network Packet"
        device_type = "Device_Type: "+""
        vendor_id = "Vendor_ID: Omron Corporation."
        ip = "IP: " + pkt.ip.src
        mac = "Mac: " + pkt.eth.src
        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        if raw_pkt.find(b'\x2d') != -1:
            string = str(raw_pkt)
            pattern = re.compile(r'\\x00(\w+-\w+)\s+([\d.]+)')

            match = pattern.search(string)

            if match:
                product_name = match.group(1)
                product_name = "Product_Name: " + product_name.replace('P', '', 1)
                version_number = "Version: " + match.group(2)
                all_value = (source,device_type,vendor_id,ip,mac, product_name,version_number,mac_manuf)
                new_list.append(all_value)
        else:
            pass
    except:
        pass
def process_packet_lldp(pkt):
    try:
        if 'chassis_id' in pkt.lldp.field_names:
            hex_device_type = str(pkt.lldp.chassis_id).replace(":", "")
            input_string = bytearray.fromhex(hex_device_type).decode()
            parts = filter(lambda x: x != '', input_string.split(' '))
            device_type = "Device Type: " + ' '.join(parts)
        else:
            device_type="Device_Type: "+""
        ip = "IP: "+ pkt.lldp.mgn_addr_ip4
        source = "Source: " + " Network Packet"
        #device_type = "Device_Type: "+""
        mac = "Mac: " + pkt.eth.src
        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        sys_desc = "System_Description: " + pkt.lldp.tlv_system_desc
        vendor_id = "Vendor_ID: " + get_vendor_from_file(pkt.eth.src)
        if 'tlv_system_name' in pkt.lldp.field_names:
            system_name = "System_Name: " + pkt.lldp.tlv_system_name
        else:
            system_name = "System_Name: "
        all_value=(source,device_type,ip,mac,sys_desc,vendor_id,system_name,mac_manuf)
        new_list.append(all_value)
    except AttributeError:
        pass


bacnet_patterns = {
    "vendor-name": r"vendor-name:\s*([^\n]*)",
    "firmware-revision": r"firmware-revision:\s*([^\n]*)",
    "model-name": r"model-name:\s*([^\n]*)"
}

bacnet_devices = {}
def process_packet_bacnet(pkt):
    src_mac = (pkt.eth.src.showname).split(" ")[1]
    mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
    if("IP" in str(pkt.layers)):
        src_ip = pkt.ip.src
    else:
        src_ip = "-"
    
    if src_mac not in bacnet_devices:
        bacnet_devices[src_mac] = []
    
    try:
        bacnet_packet = str(pkt.bacapp)
        for field, pattern in bacnet_patterns.items():
            match = re.search(pattern, bacnet_packet)
            if match:
                value = match.group(1)
                if "0m" in value:
                    value = re.sub(r"UTF-8\s+", "", value).strip("'")
                    value = value[10:]
                else:
                    value = re.sub(r"UTF-8\s+", "", value).strip("'")
                #print("Field {} and Value {}".format(field,value))
                if value:
                    bacnet_devices[src_mac].append((field, value))
                    bacnet_devices[src_mac].append(("IP", src_ip))
                    bacnet_devices[src_mac].append(("Device_Type", ""))
                    bacnet_devices[src_mac].append(("Source", "Network Packet"))
                    bacnet_devices[src_mac].append(("MAC_Manufacturer", str(get_vendor_from_file(pkt.eth.src))))
                else:
                    bacnet_devices[src_mac].append((field, " - "))
                    bacnet_devices[src_mac].append(("IP", src_ip))
                    bacnet_devices[src_mac].append(("Device_Type", ""))
                    bacnet_devices[src_mac].append(("Source", "Network Packet"))
                    bacnet_devices[src_mac].append(("MAC_Manufacturer", str(get_vendor_from_file(pkt.eth.src))))
    except:
        pass
def process_packet_mms(pkt):
    try:
        device_ip="IP: "+pkt.ip.src
        source = "Source: " + " Network Packet"
        device_type = "Device_Type: "+""
        device_mac="Mac: "+((pkt.eth.src.showname).split(" ")[1])
        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        vendor_id="Vendor_ID: "+pkt.mms.vendorname
        product_name="Product_Name: "+pkt.mms.modelname
        revision="Version: "+pkt.mms.revision
        all_value=(source,device_type,vendor_id,product_name,revision,device_ip,device_mac,mac_manuf)
        new_list.append(all_value)
    except AttributeError:
        pass

def get_product(pkt):
    if 'server' in pkt.browser.field_names:
        serv_type_arr_pkt=[ pkt.browser.server_type_workstation, pkt.browser.server_type_server, pkt.browser.server_type_sql,
        pkt.browser.server_type_domain_controller, pkt.browser.server_type_backup_controller, pkt.browser.server_type_time, pkt.browser.server_type_apple, 
        pkt.browser.server_type_novell, pkt.browser.server_type_member, pkt.browser.server_type_print, pkt.browser.server_type_dialin, pkt.browser.server_type_xenix, 
        pkt.browser.server_type_ntw, pkt.browser.server_type_wfw, pkt.browser.server_type_nts, pkt.browser.server_type_potential, pkt.browser.server_type_backup, 
        pkt.browser.server_type_master, pkt.browser.server_type_domain_master, pkt.browser.server_type_osf, pkt.browser.server_type_vms, pkt.browser.server_type_w95, 
        pkt.browser.server_type_dfs, pkt.browser.server_type_local, pkt.browser.server_type_domainenum]
        #print(type(pkt.browser.server_type_workstation))
        serv_type_arr_str=["Workstation","Server","SQL Server","Domain Controller","Backup Controller","Time Source",
                           "Apple Host","Novell Server","Domain Member Server","Print Queue Server","Dialin Server","Xenix Server",
                           "NT Workstation","WFW Host","NT Server","Potential Browser","Backup Browser","Master Browser","Domain Master Browser",
                           "OSF Browser","VMS Browser","WINDOWS 95 or above Host","DFS Server","Local List only request","Domain Enum Request"]
        serv_type_str=""
        for i in range(len(serv_type_arr_pkt)-1):
            if '1' in (serv_type_arr_pkt[i].showname):
                serv_type_str=serv_type_str+serv_type_arr_str[i]+","
    return serv_type_str[:-1]

def extract_name_from_version(version, file_path):
    with open(file_path, 'r') as file:
        lines = file.readlines() 
# Lines list containing all the version and windows name mappings in the below format
# ['Windows XP\tNT 5.1\n', 'Windows XP\tNT 5.2\n', 'Windows Vista\tNT 6.0\n', 
#  'Windows NT 4.0\tNT 4.0\n', 'Windows NT 3.51\tNT 3.51\n', 'Windows NT 3.5\tNT 3.5\n', 'Windows NT 3.1\tNT 3.1\n', 'Windows Me\t4.9\n', 
#  'Windows 2000\tNT 5.0\n', 'Windows 98 Second Edition\t4.1\n', 'Windows 98\t4.1\n', 'Windows 95\t4\n', 'Windows 11 version 23H2\t23H2\n']
#\t->tab delimiter \n->new line delimiter
    version_mapping = {} # dictionary to map the version and windows names

    for line in lines:
        columns = line.strip().split('\t') # new list containing elements like ['Windows XP' , 'NT 5.1']
        if len(columns) == 2:
            key = columns[1].split(' ')[-1] if 'NT' in columns[1] else columns[1]
            version_mapping[key] = columns[0]
# the key for the dictionary version mapping is version itself and value is name of windows
    return version_mapping.get(version, None)
#windows_file_path =  r"C:\Users\User\Talent Next\Python\OT_Project\windows_version_mappings.txt"
windows_file_path =  r"/home/kathan/ICS-Parser/windows_version_mappings.txt"
def process_packet_browser(pkt):
    try:
        if 'server' in pkt.browser.field_names:
            source = "Source: " + " Network Packet"
            device_type = "Device_Type: "+""
            device_ip="IP: "+pkt.ip.src
            device_mac="Mac: "+((pkt.eth.src.showname).split(" ")[1])
            vendor_id="Vendor_ID: " + ""
            host_name="System_Name: "+pkt.browser.server
            version="Version: " + extract_name_from_version(pkt.browser.os_major + "." + pkt.browser.os_minor,windows_file_path )
            product_name="Product_Name: " + get_product(pkt)
            mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
            all_value=(source,device_type,vendor_id,device_ip,device_mac,host_name,version,product_name,mac_manuf)
            print(all_value)
            new_list.append(all_value)
    except AttributeError:
        pass
def get_vendor_name(name):
    machine_dict={
        "MSFT 5.0": "Windows Machine",
        #Add more mappings as you get for DHCP
    }
    return machine_dict.get(name, "")
def process_packet_dhcp(pkt):
    try: 
        if 'dhcp' in pkt:
            if 'option_dhcp' in pkt.dhcp.field_names:
                temp=['hw_mac_addr','option_requested_ip_address','option_hostname','option_vendor_class_id']
                if all(string in pkt.dhcp.field_names for string in temp):
                    if pkt.dhcp.option_dhcp=='1':
                        source = "Source: " + " Network Packet"
                        device_type = "Device_Type: "+""
                        device_mac="Mac: " + pkt.dhcp.hw_mac_addr
                        device_ip="IP: " + pkt.dhcp.option_requested_ip_address
                        sys_name="System_Name: " + pkt.dhcp.option_hostname
                        sys_desc = "System_Description: " + pkt.dhcp.option_vendor_class_id + "(" + get_vendor_name(pkt.dhcp.option_vendor_class_id) +")"
                        vendor_id="Vendor_ID: " + ""
                        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.dhcp.hw_mac_addr)
                        all_value=(source,device_type,vendor_id,device_ip,device_mac,sys_name,sys_desc,mac_manuf)
                        new_list.append(all_value)
                    elif pkt.dhcp.option_dhcp=='3':
                        device_type = "Device_Type: "+""
                        source = "Source: " + " Network Packet"
                        device_mac="Mac: " + pkt.dhcp.hw_mac_addr
                        device_ip="IP: " + pkt.dhcp.option_requested_ip_address
                        sys_name="System_Name: " + pkt.dhcp.option_hostname
                        sys_desc = "System_Description: " + pkt.dhcp.option_vendor_class_id + "(" + get_vendor_name(pkt.dhcp.option_vendor_class_id) +")"
                        vendor_id="Vendor_ID: " + ""
                        mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.dhcp.hw_mac_addr)
                        all_value=(source,device_type,vendor_id,device_ip,device_mac,sys_name,sys_desc,mac_manuf)
                        new_list.append(all_value)
    except AttributeError:
        pass
def process_packet_arp(pkt):
    try:
        if 'arp' in pkt:
            vendor_id="Vendor_ID: " + ""
            source = "Source: " + " Network Packet"
            device_type = "Device_Type: "+""
            device_mac="Mac: " + pkt.arp.src_hw_mac
            device_ip="IP: " + pkt.arp.src_proto_ipv4
            product_name="Product_Name: "+""
            mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.arp.src_hw_mac)
            all_value=(device_type,vendor_id,device_mac,device_ip,product_name,mac_manuf)
            new_list.append(all_value)
            device_type = "Device_Type: "+""
            vendor_id="Vendor_ID: " + ""
            device_mac="Mac: " + pkt.arp.dst_hw_mac
            device_ip="IP: " + pkt.arp.dst_proto_ipv4
            product_name="Product_Name: " + ""
            mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.arp.dst_hw_mac)
            if pkt.arp.dst_hw_mac!="ff:ff:ff:ff:ff:ff" :
                if pkt.arp.dst_hw_mac!="00:00:00:00:00:00":
                    all_value=(source,device_type,vendor_id,device_mac,device_ip,product_name,mac_manuf)
            new_list.append(all_value)

    except AttributeError:
        pass
def get_vendor_id(name):
    vendor_dict={
        "6ES7": "Siemens",
        #Add more mappings as you get for EPM
    }
    return vendor_dict.get(name, "")
def process_packet_epm(pkt):
    try:
        p_name=""
        m_number=""
        m_version=""
        if 'annotation' in pkt.epm.field_names:
            temp=str(pkt.epm.annotation).split()
            index_of_V = temp.index('V')
            m_version = '.'.join(temp[index_of_V+1:])
            m_number = ' '.join(temp[index_of_V-3:index_of_V-1])
            p_name = ' '.join(temp[:index_of_V-3])
            source = "Source: " + " Network Packet"
            vendor_id = "Vendor_ID: " + get_vendor_id(temp[index_of_V-3])
            device_type = "Device_Type: "+""
            product_name = "Product_Name: " + p_name
            m_version = "Firmware_Version: " + m_version
            m_number = "Module_Number: " + m_number
            device_mac="Mac: " + pkt.eth.src
            device_ip="IP: " + pkt.ip.src
            mac_manuf="MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)

            all_value=(source,device_type,vendor_id,product_name,m_version,m_number,device_ip,device_mac,mac_manuf)
            new_list.append(all_value)
    except AttributeError:
        pass
def process_packet_mewtocol(pkt):
    try:
        if 'mewtocol' in pkt:
            if 'panasonic_payload_firmware' in pkt.mewtocol.field_names:
                source = "Source: " + " Network Packet"
                version = "Version: " + str(pkt.mewtocol.panasonic_payload_firmware)
                ip = "IP: " + pkt.ip.src
                device_type = "Device_Type: "+""
                mac = "Mac: " + pkt.eth.src
                vendor_id = "Vendor_ID: Panasonic"
                mac_manuf = "MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
                product_name = "Product_Name: " + ""
                all_value = (source,device_type,ip,mac,vendor_id,version,mac_manuf,product_name)
                new_list.append(all_value)
    except AttributeError:
        pass
def process_packet_panasonic_discovery(pkt):
    try:
        source = "Source: " + " Network Packet"
        ip = "IP: " + pkt.ip.src
        device_type = "Device_Type: "+""
        mac = "Mac: " + pkt.eth.src
        vendor_id = "Vendor_ID: " + get_vendor_from_file(pkt.panasonic_discovery.payload_macaddress)
        version = "Version: "
        product_name = "Product_Name: " + ""
        mac_manuf = "MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
        if 'payload_cputype' in pkt.panasonic_discovery.field_names:
            cpu_type = "CPU_Type: " + pkt.panasonic_discovery.payload_cputype.replace(" ","_")
        elif 'payload_cpuname' in pkt.panasonic_discovery.field_names:
            cpu_type = "CPU_Type: " + pkt.panasonic_discovery.payload_cpuname.replace(" ","_")
        if 'payload_firmware' in pkt.panasonic_discovery.field_names:
            version = "Version: " + str(pkt.panasonic_discovery.payload_firmware)
        all_value = (source,device_type,ip,mac,vendor_id,mac_manuf,product_name,cpu_type,version)
        new_list.append(all_value)
    except AttributeError:
        pass

Device_dict={}
def process_packet_hikevision(pkt):
    try:
        if 'xml' in pkt:
            if '<DeviceInfo version' in pkt.xml.tag:
                temp = str(pkt.xml.cdata.all_fields)
                xml_data_string = temp.replace("<LayerField xml.cdata: ","").replace(">","")[1:-1]  # remove brackets
                xml_data_array = xml_data_string.split(",")
                
                device_specs=['Device_Name','Device_ID','Device_Description','Device_Location', 'System_Contact','Model','Serial_Number','MAC_Address','Firmware_version',
                'Firmware_Released_Date','Encoder_version','Encoder_released_date','Boot_version','Boot_released_date','Hardware_version','Device_type',
                'Telecontrol_ID','Support_beep','Support_video_loss','Firmware_version_info','Manufacturer','Sub_serial_number','OEM_code']
                

                if len(device_specs) == len(xml_data_array):
                    for i in range(len(device_specs)):
                        Device_dict[device_specs[i]]=xml_data_array[i]
                source = "Source: " + " Network Packet"
                vendor_id = "Vendor_ID: " +  Device_dict['Manufacturer'].strip()
                device_type = "Device_Type: " + Device_dict['Device_type'].strip()
                product_name = "Product_Name: " + Device_dict['Device_Name'].strip()
                firmware_version = "Version: " + Device_dict['Firmware_version'].strip()
                serial_number = "Serial_Number: " + Device_dict['Serial_Number'].strip()
                ip = "IP: " + pkt.ip.src
                mac = "Mac: " + Device_dict['MAC_Address'].strip()
                device_id = "System_Description: " + "Device ID " + Device_dict['Device_ID'].strip()
                device_location = "Additional_Component: " + "Device Location " + Device_dict['Device_Location'].strip()
                mac_manuf = "MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
                all_value = (source,vendor_id,device_type,product_name,firmware_version,serial_number,ip,mac,device_id,device_location,mac_manuf)
                
                new_list.append(all_value)
            
    except AttributeError:
        pass
def process_packet_dnp3(pkt):
    try:
        product_name, module_num, vendor_id, serial_number, subset, software_version, hardware_version = "","","","","","",""
        if 'al_obj' in pkt.dnp3.field_names:
            if 'al_da_value' in pkt.dnp3.field_names:
                source = "Source: " + " Network Packet"
                ip = "IP: " + pkt.ip.src
                device_type = "Device_Type: "+""
                mac = "Mac: " + pkt.eth.src
                mac_manuf = "MAC_Manufacturer: " + get_vendor_from_file(pkt.eth.src)
                if pkt.dnp3.al_obj == '0x00fa':
                    parts = pkt.dnp3.al_da_value.split()
                    prod_name = parts[0]
                    model_and_series = " ".join(parts[1:])
                    product_name = "Product_Name: " + prod_name.strip()
                    module_num = "Module_Number: " + model_and_series.strip()
                elif pkt.dnp3.al_obj == '0x00fc':
                    vendor_id = "Vendor_ID: " + pkt.dnp3.al_da_value.strip()
                elif pkt.dnp3.al_obj == '0x00f8':
                    serial_number = "Serial_Number: " + pkt.dnp3.al_da_value.strip()
                elif pkt.dnp3.al_obj == '0x00f9':
                    subset = "Additional_Component: " + "Subset/Conformance " + pkt.dnp3.al_da_value.strip()
                elif pkt.dnp3.al_obj == '0x00f2':
                    software_version = "Version: " + pkt.dnp3.al_da_value.strip()
                elif pkt.dnp3.al_obj == '0x00f3':
                    hardware_version = "System_Description: " + "Hardware Version " + pkt.dnp3.al_da_value.strip()
                
                all_value = (source,device_type,ip,mac,product_name,module_num,vendor_id,serial_number,subset,software_version,hardware_version,mac_manuf)
                new_list.append(all_value)
                #print(new_list)
    except AttributeError:
        pass

def extract_HWTYPE(asset_list, product_list):
    
    for asset in asset_list:
        for product in product_list:
            if 'Device_Type' in asset and str(asset["Device_Type"]).strip() != "":
                #print("entered")
                break
            
            if 'System_Name' in asset:
                system_name = str(asset["System_Name"]).lower()
                system_name = ''.join(char for char in system_name if char.isalnum())
            else:
                system_name = ""
            
            if 'Product_Name' in asset:
                product_name = str(asset["Product_Name"]).lower()
                product_name = ''.join(char for char in product_name if char.isalnum())
            else:
                product_name = ""
            
            hardware_product_name = str(product["HWPRODUCTNAME"]).lower()
            hardware_product_name = ''.join(char for char in hardware_product_name if char.isalnum())

            hardware_product_family = str(product["HWPRODUCTFAMILY"]).lower()
            hardware_product_family = ''.join(char for char in hardware_product_family if char.isalnum())

            if 'CPU_Type' in asset:
                cpu_type = str(asset["CPU_Type"]).lower()
                cpu_type = ''.join(char for char in cpu_type if char.isalnum())
            else:
                cpu_type = ""

            if 'Serial_Number' in asset:
                serial_number = str(asset["Serial_Number"]).lower()
                serial_number = ''.join(char for char in serial_number if char.isalnum())
            else:
                serial_number = ""

            hardware_product_model = str(product["HWPRODUCTMODEL"]).lower()
            hardware_product_model = ''.join(char for char in hardware_product_model if char.isalnum())

            # Condition 1
            if (('Vendor_ID' in asset and str(asset["Vendor_ID"]).lower() in str(product["HWMANUFACTURERFULLNAME"]).lower()) or
                str(asset["MAC_Manufacturer"]).lower() in str(product["HWMANUFACTURERFULLNAME"]).lower() or
                (str(product["HWMANUFACTURERFULLNAME"]).lower() == "nan" and (('Vendor_ID' in asset and str(asset["Vendor_ID"]).lower() in str(product["DISCOVEREDMANUFACTURER"]).lower()) or str(asset["MAC_Manufacturer"]).lower() in str(product["DISCOVEREDMANUFACTURER"]).lower()))):
                #print("Entered the first if condition")
                # Condition 2
                if (system_name != "" and
                    (system_name == hardware_product_name or 
                     ( hardware_product_name == "nan" and system_name == hardware_product_family))):
                    asset["Device_Type"] = (str(product["HWQUALYSLEVEL2"]))
                    break

                elif (product_name != "" and
                    (product_name == hardware_product_name or 
                     ( hardware_product_name == "nan" and product_name == hardware_product_family))):
                    asset["Device_Type"] = (str(product["HWQUALYSLEVEL2"]))
                    break

                elif (cpu_type!="" and
                      (cpu_type == hardware_product_name or
                       (hardware_product_name == "nan" and cpu_type == hardware_product_family))):
                    asset["Device_Type"] = (str(product["HWQUALYSLEVEL2"]))
                    break
                
                # Condition 3
                if serial_number != "":
                    if (hardware_product_model != "nan" and
                        serial_number == hardware_product_model):
                        asset["Device_Type"] = (str(product["HWQUALYSLEVEL2"]))
                        break
            
                
    
    return asset_list

# create a pool of threads to execute the function
with concurrent.futures.ThreadPoolExecutor() as executor:
    # map the function to the list of packets and execute in parallel using multiple threads
    executor.map(process_packet_s7comm, filtered_cap_s7comm)
    executor.map(process_packet_enip, filtered_cap_enip)
    executor.map(process_packet_cip, filtered_cap_cip)
    executor.map(process_packet_cipcm, filtered_cap_cip)
    executor.map(process_packet_omron, filtered_cap_omron)
    executor.map(process_packet_modbus, filtered_cap_modbus)
    executor.map(process_packet_lldp, filtered_cap_lldp)
    executor.map(process_packet_bacnet, filtered_cap_bacnet)
    executor.map(process_packet_mms, filtered_cap_mms)
    executor.map(process_packet_browser, filtered_cap_browser)
    executor.map(process_packet_dhcp, filtered_cap_dhcp) #4
    executor.map(process_packet_arp, filtered_cap_arp)
    executor.map(process_packet_epm, filtered_cap_epm)
    executor.map(process_packet_mewtocol, filtered_cap_mewtocol)
    executor.map(process_packet_panasonic_discovery, filtered_cap_panasonic_discovery)
    executor.map(process_packet_hikevision, filtered_cap_hikevision)
    executor.map(process_packet_dnp3, filtered_cap_dnp3)

if len(bacnet_devices) > 0:
    bacnet_result = [{'Mac': mac, **{'Vendor ID' if key == 'vendor-name' else 'Version' if key == 'firmware-revision' else 'Product Name' if key == 'model-name' else 'Software Version' if key == 'application-software-version' else key: value for key, value in tuples}} for mac, tuples in bacnet_devices.items()]
    for data in bacnet_result:
        tuple_data = tuple(f"{key}: {value}" for key, value in data.items())
        #print(tuple_data)
        new_list.append(tuple_data)

data = list(set(new_list)) #data
data = [tup for tup in data if 'IP: 0.0.0.0' not in tup]
data_list = [] # list of dictionaries with no redundant values
for tup in data:# this converts the tuple to dictionary
    data_dict = {}
    for item in tup:
        values = item.split(': ')
        key = values[0]
        value = ': '.join(values[1:])
        data_dict[key] = value
    data_list.append(data_dict)
# use the data list to merge

def merge_dictionaries(dict1, dict2):
    merged_dict = dict1.copy() # Define a function merge_dictionaries that takes two dictionaries (dict1 and dict2) as arguments. Initialize merged_dict with a copy of dict1

    for key, value2 in dict2.items(): # Loop through key-value pairs in dict2, excluding the 'Mac' key.
        if key != 'Mac':
            value1 = merged_dict.get(key, '') # Get the corresponding value from merged_dict for the current key. If the key is not present, default to an empty string.

            # Condition 1: if both values are exactly the same, do nothing
            if value1 == value2:
                pass
            # Condition 2: if either value is "", keep it as null
            elif not value1 or not value2: # If either value is an empty string, keep the non-empty value.
                merged_dict[key] = value1 or value2
            else:
                # Condition 3: if values are completely distinct, concatenate
                if value1 not in value2 and value2 not in value1: # If values are completely distinct (neither value is contained in the other), concatenate them with a space in between.
                    merged_dict[key] = f"{value1} {value2}"
                else: # If values are partially distinct, merge the non-common aspect by finding the common prefix and concatenating the uncommon parts.
                    # Condition 4: partially distinct, merge non-common aspect
                    set1 = set(value1.split())
                    set2 = set(value2.split())

                    # Union of sets to merge distinct elements
                    merged_set = set1.union(set2)

                    # Convert the set back to a string
                    merged_string = ' '.join(merged_set)
                    merged_dict[key] = f"{merged_string}".strip()

    return merged_dict

mac_dict = {}

for data in data_list:
    mac_address = data['Mac']
    
    if mac_address not in mac_dict:
        mac_dict[mac_address] = data
    else:
        existing_data = mac_dict[mac_address]
        merged_data = merge_dictionaries(existing_data, data)
        mac_dict[mac_address] = merged_data

result = list(mac_dict.values())

if result:
    product_list_temp = r"/home/kathan/ICS-Parser/Product_type.txt"

    with open(product_list_temp, 'r') as file:
        product_list = json.load(file)  

    result = extract_HWTYPE(result, product_list)
    
    for i in result:
        #print(i)
        if 'Device_Type' in i and i["Device_Type"] == "":
            i["Device_Type"]="Others"
    #print(result)
    #print(result)
    call_for_asset_vulnerability(result)
    
else:
    pass

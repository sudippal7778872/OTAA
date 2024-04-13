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
vendor_mapping = {
    "Rockwell Automation/Allen-Bradley (0x0001)": "Rockwell",
    "Siemens AG": "Siemens",
    "Rockwell":"Rockwell",
    "Omron Corporation (0x002f)":"Omron",
    "Omron Corporation.":"Omron",
    "Danfoss (0x0061)": "Danfoss",
    "Schneider Automation, Inc. (0x00f3)":"Schneider Signature",
    "TURCk, Inc. (0x0030)":"Turck",
    "Prosoft Technology (0x0135)":"Prosoft",
    # Add more mappings as needed
}
def call_vulnerability(vendor,product):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    signatures_dir = os.path.join(current_dir, "Signatures")
    mapped_vendor = vendor_mapping.get(vendor, vendor)
    vendor_folder = os.path.join(signatures_dir, mapped_vendor)
    
    results = []  # List to store the results

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
                
                product_match = re.search(rf"{re.escape(product)}", signature, re.IGNORECASE)
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

def call_for_asset_vulnerability(data_list):
    data_list = [{key.replace(' ', '_'): value for key, value in item.items()} for item in data_list]
    asset_id=1
    vul_id=1
    for entry in data_list:
        entry["Asset_ID"]=asset_id
        if 'Product_Name' in entry:
            vendor_id=entry['Vendor_ID']
            product_name=entry['Product_Name']

        elif 'System_Name' in entry:
            vendor_id=entry['Vendor_ID']
            product_name=entry['System_Name']
        asset_mac=entry["Mac"]
        asset_ip=entry["IP"]
        
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

    # filename1="asset&vuln.json"
    # with open(filename1, 'w') as file:
    #     json.dump(user_data, file)      


    client = pymongo.MongoClient(mongodb_url)
    db = client[database_name]
    collection = db[collection_name]
    result=collection.insert_one(user_data)
    #print(f"Inserted document with ID: {result.inserted_id}")




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

#list that store the results from functions
new_list = []
seimens_list = []
def process_packet_s7comm(pkt):
    src_mac = "Mac: " + (pkt.eth.src.showname).split(" ")[1]
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
        temp_tuple = (src_mac, product_name, serial_number, cpu_type, memory_type,src_ip, vendor_id)
        seimens_list.append(temp_tuple)

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
        temp_tuple = (src_mac, module_num, module_version,src_ip, vendor_id)
        seimens_list.append(temp_tuple)
    except AttributeError:
        pass

def process_packet_enip(pkt):
    try:
        vendor_id = pkt.enip.lir_vendor.showname
        device_type = pkt.enip.lir_devtype.showname
        product_name = pkt.enip.lir_name.showname
        revision = "Version: " + ((pkt.enip.lir_revision.showname).split(":")[1].strip())
        serial_number = pkt.enip.lir_serial.showname
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])

        all_value = (vendor_id,device_type,product_name,revision,serial_number,device_ip,device_mac)
        new_list.append(all_value)
    except AttributeError:
        pass

def process_packet_cip(pkt):
    try:
        vendor_id = pkt.cip.id_vendor_id.showname
        device_id = pkt.cip.id_device_type.showname
        product_name = pkt.cip.id_product_name.showname
        major_revision = pkt.cip.id_major_rev
        minor_revision = pkt.cip.id_minor_rev
        revision = "Version: " + major_revision +"."+ minor_revision
        serial_number = pkt.cip.id_serial_number.showname
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        
        all_value = (vendor_id,device_id,product_name,revision,serial_number,device_ip,device_mac)
        new_list.append(all_value)
    except AttributeError:
        pass

def process_packet_cipcm(pkt):
    try:
        vendor_id = pkt.cipcm.cip_id_vendor_id.showname
        device_id = pkt.cipcm.cip_id_device_type.showname
        product_name = pkt.cipcm.cip_id_product_name.showname
        serial_number = pkt.cipcm.cip_id_serial_number.showname
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        major_revision = pkt.cipcm.cip_id_major_rev
        minor_revision = pkt.cipcm.cip_id_minor_rev
        revision = "Version: " + major_revision +"."+ minor_revision
        
        all_value = (vendor_id,device_id,product_name,revision,serial_number,device_ip,device_mac)
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
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        value = extract_string_values(modbus_data)
        if value is not None:
            temp_obj_list = []
            temp_obj_list.extend(value)
            vendor = "Vendor_ID: " + temp_obj_list[0]
            product_name = "Product_Name: " + temp_obj_list[1]
            version = "Version: " + (temp_obj_list[2])[1:]
            all_value = (vendor, product_name, version, device_ip, device_mac)
            new_list.append(all_value)
    except AttributeError:
        pass

def process_packet_omron(pkt):
    try:
        raw_pkt = pkt.get_raw_packet()
        vendor_id = "Vendor_ID: Omron Corporation."
        ip = "IP: " + pkt.ip.src
        mac = "Mac: " + pkt.eth.src
        if raw_pkt.find(b'\x2d') != -1:
            string = str(raw_pkt)
            pattern = re.compile(r'\\x00(\w+-\w+)\s+([\d.]+)')

            match = pattern.search(string)

            if match:
                product_name = match.group(1)
                product_name = "Product_Name: " + product_name.replace('P', '', 1)
                version_number = "Version: " + match.group(2)
                all_value = (vendor_id,ip,mac, product_name,version_number)
                new_list.append(all_value)
        else:
            pass
    except:
        pass

def get_vendor_from_file(mac_address):
    tree = ET.parse("vendorMacs.xml")
    root = tree.getroot()
    mac_address = mac_address.upper()
    for elem in root:
        if mac_address.startswith(elem.attrib["mac_prefix"] + ":"):
            return elem.attrib["vendor_name"]

def process_packet_lldp(pkt):
    try:

        hex_device_type = str(pkt.lldp.chassis_id).replace(":", "")
        device_type = "Device_Type: " + bytearray.fromhex(hex_device_type).decode()
        ip = "IP: "+ pkt.lldp.mgn_addr_ip4
        mac = "Mac: " + pkt.eth.src
        sys_desc = "System_Description: " + pkt.lldp.tlv_system_desc
        vendor_id = "Vendor_ID: " + get_vendor_from_file(pkt.eth.src)
        system_name = "System_Name: " + pkt.lldp.tlv_system_name
        all_value = (vendor_id, device_type,ip,mac, system_name,sys_desc)
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
                value = re.sub(r"UTF-8\s+", "", value).strip("'")
                #print("Field {} and Value {}".format(field,value))
                if value:
                    bacnet_devices[src_mac].append((field, value))
                    bacnet_devices[src_mac].append(("IP", src_ip))
                else:
                    bacnet_devices[src_mac].append((field, " - "))
                    bacnet_devices[src_mac].append(("IP", src_ip))
    except:
        pass

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

result = list(set(new_list))
data_list = []
for tup in result:
    data_dict = {}
    for item in tup:
        values = item.split(': ')
        key = values[0]
        value = ': '.join(values[1:])
        data_dict[key] = value
    data_list.append(data_dict)

if len(seimens_list) > 0:
    merged = {}
    for lst in seimens_list:
        mac = lst[0]
        if mac not in merged:
            merged[mac] = []
        merged[mac].append(lst[1:])

    final = {}
    for mac, lsts in merged.items():
        fields = {}
        for lst in lsts:
            for field in lst:
                key, value = field.split(": ")
                fields[key] = value
        final[mac] = fields

    result = [{'Mac': mac, **device_info} for mac, device_info in final.items()]
    for d in result:
        d["Mac"] = d["Mac"].replace("Mac: ", "")
    for data in result:
        data_list.append(data)

if len(bacnet_devices) > 0:
    bacnet_result = [{'Mac': mac, **{'Vendor_ID' if key == 'vendor-name' else 'Version' if key == 'firmware-revision' else 'Product_Name' if key == 'model-name' else 'Software_Version' if key == 'application-software-version' else key: value for key, value in tuples}} for mac, tuples in bacnet_devices.items()]
    for data in bacnet_result:
        data_list.append(data)

if data_list:
    #print(data_list)
    call_for_asset_vulnerability(data_list)
    
else:
    pass
import json
import pyshark
import sys
import concurrent.futures
import re
import xml.etree.ElementTree as ET

get_file = sys.argv[1]
get_username= sys.argv[2]
#get_file = "./appdata/test.pcap"
#get_username= "sudip"
username= "userId: "+ get_username

filtered_cap_s7comm = pyshark.FileCapture(get_file, display_filter="s7comm.szl.xy11.0001.ausbg || s7comm.szl.001c.0001.name")
filtered_cap_enip = pyshark.FileCapture(get_file, display_filter="enip.lir.name")
filtered_cap_cip = pyshark.FileCapture(get_file, display_filter="cip.id.product_name")
filtered_cap_modbus = pyshark.FileCapture(get_file, display_filter="modbus.object_id == 1")
filtered_cap_lldp = pyshark.FileCapture(get_file, display_filter="lldp.tlv.system.desc")
filtered_cap_omron = pyshark.FileCapture(get_file, display_filter="omron", use_json=True, include_raw=True)
filtered_cap_bacnet = pyshark.FileCapture(get_file, display_filter="bacapp.application_tag_number == 7")
filtered_cap_mms = pyshark.FileCapture(get_file, display_filter="mms.vendorName")

#list that store the results from functions
new_list = []
seimens_list = []
def process_packet_s7comm(pkt):
    src_mac = "Mac: " + (pkt.eth.src.showname).split(" ")[1]
    if("IP" in str(pkt.layers)):
        src_ip = "IP: " + pkt.ip.src
    else:
        src_ip = "IP: " + "-"
    vendor_id = "Vendor ID: Siemens AG"
    try:
        product_name = "System Name: " + (pkt.s7comm.szl_001c_0001_name.showname).split(":")[1].strip()
        serial_number = "Serial Number: " + (pkt.s7comm.szl_001c_0005_serialn.showname).split(":")[1].strip()
        cpu_type = "CPU Type: " + (pkt.s7comm.szl_001c_0007_cputypname.showname).split(":")[1].strip()
        memory_type = "Additional Component: " + (pkt.s7comm.szl_001c_0008_snmcmmc.showname).split(":")[1].strip()
        temp_tuple = (src_mac, product_name, serial_number, cpu_type, memory_type,src_ip, vendor_id, username)
        seimens_list.append(temp_tuple)

    except AttributeError:
        pass

    try:
        module_num = "Module Number: " + (pkt.s7comm.szl_xy11_0001_anz.showname).split(":")[1].strip()
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
        temp_tuple = (src_mac, module_num, module_version,src_ip, vendor_id, username)
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

        all_value = (vendor_id,device_type,product_name,revision,serial_number,device_ip,device_mac, username)
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
        
        all_value = (vendor_id,device_id,product_name,revision,serial_number,device_ip,device_mac, username)
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
        
        all_value = (vendor_id,device_id,product_name,revision,serial_number,device_ip,device_mac, username)
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
            vendor = "Vendor ID: " + temp_obj_list[0]
            product_name = "Product Name: " + temp_obj_list[1]
            version = "Version: " + (temp_obj_list[2])[1:]
            all_value = (vendor, product_name, version, device_ip, device_mac, username)
            new_list.append(all_value)
    except AttributeError:
        pass

def process_packet_omron(pkt):
    try:
        raw_pkt = pkt.get_raw_packet()
        vendor_id = "Vendor ID: Omron Corporation."
        ip = "IP: " + pkt.ip.src
        mac = "Mac: " + pkt.eth.src
        if raw_pkt.find(b'\x2d') != -1:
            string = str(raw_pkt)
            pattern = re.compile(r'\\x00(\w+-\w+)\s+([\d.]+)')

            match = pattern.search(string)

            if match:
                product_name = match.group(1)
                product_name = "Product Name: " + product_name.replace('P', '', 1)
                version_number = "Version: " + match.group(2)
                all_value = (vendor_id,ip,mac, product_name,version_number, username)
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
        device_type = "Device Type: " + bytearray.fromhex(hex_device_type).decode()
        ip = "IP: "+ pkt.lldp.mgn_addr_ip4
        mac = "Mac: " + pkt.eth.src
        sys_desc = "System Description: " + pkt.lldp.tlv_system_desc
        vendor_id = "Vendor ID: " + get_vendor_from_file(pkt.eth.src)
        system_name = "System Name: " + pkt.lldp.tlv_system_name
        all_value = (vendor_id, device_type,ip,mac, system_name,sys_desc, username)
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
                    bacnet_devices[src_mac].append(("User", get_username))
                else:
                    bacnet_devices[src_mac].append((field, " - "))
                    bacnet_devices[src_mac].append(("IP", src_ip))
                    bacnet_devices[src_mac].append(("User", get_username))
    except:
        pass

def process_packet_mms(pkt):
    try:
        device_ip = "IP: " + pkt.ip.src
        device_mac = "Mac: " + ((pkt.eth.src.showname).split(" ")[1])
        vendor_id = "Vendor: " + pkt.mms.vendorname
        product_name = "Product Name: " + pkt.mms.modelname
        revision = "Version: " + pkt.mms.revision
        all_value = (vendor_id,product_name,revision,device_ip,device_mac, username)
        new_list.append(all_value)
    except AttributeError:
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
    executor.map(process_packet_mms, filtered_cap_mms)

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
    bacnet_result = [{'Mac': mac, **{'Vendor ID' if key == 'vendor-name' else 'Version' if key == 'firmware-revision' else 'Product Name' if key == 'model-name' else 'Software Version' if key == 'application-software-version' else key: value for key, value in tuples}} for mac, tuples in bacnet_devices.items()]
    for data in bacnet_result:
        data_list.append(data)

if data_list:
    #print(data_list)
    json_data = json.dumps(data_list)
    print(json_data)
else:
    pass
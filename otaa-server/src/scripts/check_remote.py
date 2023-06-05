import sys
import re
import pyshark
import concurrent.futures

get_file = sys.argv[1]

find_teamviewer = pyshark.FileCapture(get_file,display_filter='frame matches "_teamviewer"')

details = []
def detech_teamviewer(pkt):
    remote_soft = "Remote Software: TeamViewer."
    try:
        dns = pkt.dns.qry_name
        match = re.search('_teamviewer',dns)
        if match:
            src_ip = pkt.ip.src
            dst_ip = pkt.ip.dst
            src_mac = pkt.eth.src
            all_value = (remote_soft,src_ip,dst_ip,src_mac)
            details.append(all_value)
        else:
            pass
    except:
        pass

    try:
        dns = str(pkt.mdns.dns_qry_name)
        match = re.search('_teamviewer',dns)
        if match:
            src_ip = "Source IP: " + pkt.ip.src
            dst_ip = "Destination IP: " + pkt.ip.dst
            src_mac = "Source Device Mac: " + pkt.eth.src
            all_value = (remote_soft,src_ip,dst_ip,src_mac)
            details.append(all_value)
        else:
            pass
    except:
        pass

with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(detech_teamviewer, find_teamviewer)

result = list(set(details))
data_list = []
for tup in result:
    data_dict = {}
    for item in tup:
        values = item.split(': ')
        key = values[0]
        value = ': '.join(values[1:])
        data_dict[key] = value
    data_list.append(data_dict)

print(data_list)
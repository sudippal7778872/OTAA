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
new_list=[]
pcap_file = r"/home/kathan/ICS-Parser/pcaps/selected_packet_browser.pcapng"
capture = pyshark.FileCapture(pcap_file,display_filter='browser')
def get_product(pkt):
    if 'server' in pkt.browser.field_names:
        serv_type_arr_pkt=[ pkt.browser.server_type_workstation, pkt.browser.server_type_server, pkt.browser.server_type_sql,
        pkt.browser.server_type_domain_controller, pkt.browser.server_type_backup_controller, pkt.browser.server_type_time, pkt.browser.server_type_apple, 
        pkt.browser.server_type_novell, pkt.browser.server_type_member, pkt.browser.server_type_print, pkt.browser.server_type_dialin, pkt.browser.server_type_xenix, 
        pkt.browser.server_type_ntw, pkt.browser.server_type_wfw, pkt.browser.server_type_nts, pkt.browser.server_type_potential, pkt.browser.server_type_backup, 
        pkt.browser.server_type_master, pkt.browser.server_type_domain_master, pkt.browser.server_type_osf, pkt.browser.server_type_vms, pkt.browser.server_type_w95, 
        pkt.browser.server_type_dfs, pkt.browser.server_type_local, pkt.browser.server_type_domainenum]
        #print(pkt.browser.server_type_workstation.showname)
        serv_type_arr_str=["Workstation","Server","SQL Server","Domain Controller","Backup Controller","Time Source",
                           "Apple Host","Novell Server","Domain Member Server","Print Queue Server","Dialin Server","Xenix Server",
                           "NT Workstation","WFW Host","NT Server","Potential Browser","Backup Browser","Master Browser","Domain Master Browser",
                           "OSF Browser","VMS Browser","WINDOWS 95 or above Host","DFS Server","Local List only request","Domain Enum Request"]
        serv_type_str=""
        for i in range(len(serv_type_arr_pkt)-1):
            print(serv_type_arr_pkt[i].showname)
            if '1' in serv_type_arr_pkt[i].showname:
                serv_type_str=serv_type_str+serv_type_arr_str[i]+","
    return serv_type_str[:-1]

def process_packet_browser(pkt):
    try:
        if 'server' in pkt.browser.field_names:
            device_ip="IP: "+pkt.ip.src
            device_mac="Mac: "+((pkt.eth.src.showname).split(" ")[1])
            vendor_id="Vendor_ID: " + ""
            host_name="Host_Name: "+pkt.browser.server
            version="Version: " + "WINDOWS "+ pkt.browser.os_major + "." + pkt.browser.os_minor
            product_name="Product_Name: " + get_product(pkt)
            all_value=(vendor_id,device_ip,device_mac,host_name,version,product_name)
            new_list.append(all_value)
    except AttributeError:
        pass

for pkt in capture:
    #print(pkt)
    process_packet_browser(pkt)
    
print(new_list)
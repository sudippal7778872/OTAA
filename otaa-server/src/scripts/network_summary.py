import sys
import pyshark
import networkx as nx
from datetime import datetime
from pyvis.network import Network
import json


def get_high_level_protocol(packet):
    for layer in packet.layers:
        # Check for specific higher-level protocols you want to extract
        if "modbus" in layer.layer_name:
            return "Modbus"
        elif "S7COMM" in layer.layer_name:
            return "S7COMM"
        # else:
        #     print(layer.layer_name)
        # Add more protocols as needed...

    return None

def get_packet_summary(user_id, capture_file, output_file):
    cap = pyshark.FileCapture(capture_file, display_filter='ip')
    
    packet_summary = []
    conversations = {}
    network_graph = nx.Graph()

    for packet in cap:
        src_ip = packet.ip.src
        dst_ip = packet.ip.dst
        src_port = packet[packet.transport_layer].srcport
        dst_port = packet[packet.transport_layer].dstport
        protocol = packet.transport_layer
        length = int(packet.length)
        high_level_protocol = get_high_level_protocol(packet)

        # Create a unique key for the conversation
        key = tuple(sorted([src_ip, dst_ip]))

        if key not in conversations:
            conversations[key] = {
                "Device_A": src_ip,
                "Device_B": dst_ip,
                "First_Seen_Date": str(datetime.fromtimestamp(float(packet.sniff_timestamp))),
                "Last_Seen_Date": "",
                "Total_Bandwidth": length,
                "Protocol": set([protocol]),
                "Port": set([src_port, dst_port]),
                "Conversation": [],
            }
        else:
            conversations[key]["Total_Bandwidth"] += length
            conversations[key]["Protocol"].add(protocol)
            conversations[key]["Port"].add(src_port)
            conversations[key]["Port"].add(dst_port)

        conversations[key]["Last_Seen_Date"] = str(datetime.fromtimestamp(float(packet.sniff_timestamp)))

        if high_level_protocol:
            conversations[key]["Protocol"].add(high_level_protocol)
            protocol = high_level_protocol

        network_graph.add_edge(src_ip, dst_ip)

        conversation_entry = {
            "Timestamp": str(datetime.fromtimestamp(float(packet.sniff_timestamp))),
            "Source": src_ip,
            "Destination": dst_ip,
            "Protocol": protocol,
            "Source_Port": src_port,
            "Destination_Port": dst_port,
        }

        conversations[key]["Conversation"].append(conversation_entry)

    # Convert sets to lists to make the JSON serializable
    for conversation in conversations.values():
        conversation["Protocol"] = ", ".join(conversation["Protocol"])
        conversation["Port"] = ", ".join(map(str, conversation["Port"]))

    # Save the network graph to a .json file
    network_json = nx.node_link_data(network_graph)
    # with open("network_graph.json", 'w') as json_file:
    #     json.dump(network_json, json_file)

    packet_summary = list(conversations.values())
    
    # Create the final JSON structure
    user_data = {
        "UserID": user_id,
        "Network_Summary": packet_summary,
        "Network_Graph": network_json
    }

    print(user_data)

    # Save the JSON to the output file
    with open(output_file, 'w') as json_file:
        json.dump(user_data, json_file, indent=2)

def main():
    user_id = sys.argv[2]
    pcapfile = sys.argv[1]
    file_name = "network_summary_" + user_id + ".json"
    outputfile = file_name
    get_packet_summary(user_id, pcapfile, outputfile)


if __name__ == "__main__":
    main()
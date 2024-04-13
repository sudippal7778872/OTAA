import os
import re
import argparse
import json
no_vul_found={}
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
def find_vulnerabilities(vendor, product, verbose=False):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    signatures_dir = os.path.join(current_dir, "Signatures")
    mapped_vendor = vendor_mapping.get(vendor, vendor)
    vendor_folder = os.path.join(signatures_dir, mapped_vendor)
    results = []  # List to store the results
    if not os.path.exists(signatures_dir) or not os.path.isdir(signatures_dir):
        no_vul_found["Report"]="Not Found"
        results.append(no_vul_found)
        return results
    
    if not os.path.exists(vendor_folder) or not os.path.isdir(vendor_folder):
        no_vul_found["Report"]="Not Found"
        results.append(no_vul_found)
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
    
    if verbose:
        no_vul_found["Report"]=f"# '{product}' not found in any signature block in {vendor_folder}. Skipping...\n"
        results.append(no_vul_found)
        return results
    
    # # Write the results to a JSON file
    # output_file = os.path.join(current_dir, "output.json")
    # with open(output_file, "w") as json_file:
    #     json.dump(results, json_file, indent=4)
    return results

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("vendor_name", help="Vendor name")
    parser.add_argument("product_name", help="Product name")
    parser.add_argument("-v", "--verbose", action="store_true", help="Print debug information")
    args = parser.parse_args()
    
    advisory_list=find_vulnerabilities(args.vendor_name, args.product_name, args.verbose)
    advisory_json=json.dumps(advisory_list,indent=2)
    print(advisory_json)

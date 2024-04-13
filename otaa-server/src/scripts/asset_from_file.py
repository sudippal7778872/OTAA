import re
import sys
import json
import pymongo
import concurrent.futures

get_file = sys.argv[1]
get_UserID=sys.argv[2]
if len(sys.argv) != 3:
    sys.exit(1)

mongodb_url = "mongodb+srv://sudip:11VaqrpNHegrc2xH@cluster0.kwt4qdm.mongodb.net/otaa?retryWrites=true&w=majority"
database_name = "otaa"
collection_name = "assets"

def extract_HWTYPE_from_file(model):      
    with open(r"/home/kathan/ICS-Parser/Product_type.txt", 'r') as file:
        product_list = json.load(file)
    product_name = ""
    device_type = "Others"
    for product in product_list:    
        model_name = model.lower().split(":")[1].strip()
        hardware_product_model = str(product["HWPRODUCTMODEL"]).lower().strip()
        if hardware_product_model != "nan":
            if model_name in hardware_product_model:
                product_name = str(product["HWPRODUCTNAME"])
                device_type = str(product["HWQUALYSLEVEL2"])
                
                return str(product_name),str(device_type)
    return str(product_name),str(device_type) 

def get_SHAID(start_id = [100000]):
#SHA100001    
    while True:
        yield f"SHA{start_id[0]}"
        start_id[0] += 1

auto_inc_start_id = get_SHAID()


file_new_list = []

def process_file_Schneider(get_file):
    XEFfile = get_file
    pattern_main = re.compile(r'family="([^"]*)" partNumber="([^"]*)" vendorName="([^"]*)" version="([^"]*)"')
    with open(XEFfile, 'r') as file:
        for line in file:
            match_main = pattern_main.search(line)

            if match_main:
                new_dict = {}
                family = "Device_Type: " + match_main.group(1)
                part_number = "Model: " + match_main.group(2)
                vendor_name = "Vendor_ID: " + match_main.group(3)
                version = "Version: " + match_main.group(4)
                source = "Source: " + "File"
                product_and_type = extract_HWTYPE_from_file(part_number)
                if product_and_type is not None:
                    product,type = product_and_type
            
                product_name = "Product_Name: " + str(product)
                asset_id = "Asset_ID: " + next(auto_inc_start_id)
                all_value = (asset_id,product_name,source,version,vendor_name,part_number,family)
                for item in all_value:
                    key, value = item.split(': ', 1)  
                    new_dict[key] = value
                file_new_list.append(new_dict)

def process_file_Rockwell(get_file):
    L5Xfile = get_file
    pattern_main = re.compile(r'<Controller Use="Target" Name="(.*?)" ProcessorType="(.*?)" MajorRev="(.*?)" MinorRev="(.*?)" LastModifiedDate="(.*?)"')
    pattern_module = re.compile(r'<Module Name="(.*?)" CatalogNumber="(.*?)" Major="(.*?)" Minor="(.*?)"')
    with open(L5Xfile, 'r') as file:
        for line in file:
            
            match_main = pattern_main.search(line)
            match_module = pattern_module.search(line)

            if match_main:
                new_dict = {}
                name = str(match_main.group(1))
                system = "System_Name: " + name

                processor_type = str(match_main.group(2))
                model = "Product_Model: " + processor_type
                
                major_rev = match_main.group(3)
                minor_rev = match_main.group(4).split('"')[0]
                revision = "Version: " + major_rev + "." + minor_rev
                
                last_modified_date = "Last_Modified_Date: " + match_main.group(5)

                source = "Source: " + "File"
                product_and_type = extract_HWTYPE_from_file(model)
                if product_and_type is not None:
                    product,type = product_and_type
            
                product_name = "Product_Name: " + str(product)

                device_type = "Device_Type: " + str(type)

                asset_id = "Asset_ID: " + next(auto_inc_start_id)

                all_value = (asset_id,system, model, revision,last_modified_date,source,product_name,device_type)
                
                for item in all_value:
                    key, value = item.split(': ', 1)  
                    new_dict[key] = value
                file_new_list.append(new_dict)

            elif match_module:
                new_dict = {}
                name = str(match_module.group(1))
                system = "System_Name: " + name

                catalog_number = str(match_module.group(2).split('"', 1)[0])
                model = "Product_Model: " + catalog_number

                major = str(match_module.group(3))
                minor = str(match_module.group(4))
                revision = "Version: " + major + "." + minor
                
                product_and_type = extract_HWTYPE_from_file(model)
                if product_and_type is not None:
                    product,type = product_and_type
            
                product_name = "Product_Name: " + str(product)

                device_type = "Device_Type: " + str(type)
                source = "Source: " + "File"
                asset_id = "Asset_ID: " + next(auto_inc_start_id)
                all_value = (asset_id,system, model, revision,source,product_name,device_type)
                
                for item in all_value:
                    key, value = item.split(': ', 1)  
                    new_dict[key] = value
                file_new_list.append(new_dict)

with concurrent.futures.ThreadPoolExecutor() as executor:
    executor.map(process_file_Rockwell(get_file))
    executor.map(process_file_Schneider(get_file))

user_data = {
    "UserID": get_UserID,
    "assets_summary": file_new_list
}

# filename1="asset_from_file.json"
# with open(filename1, 'w') as file:
#     json.dump(user_data, file)      


client = pymongo.MongoClient(mongodb_url)
db = client[database_name]
collection = db[collection_name]
result=collection.insert_one(user_data)

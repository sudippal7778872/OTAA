import requests

def get_vendor(mac_address):
    # Format the MAC address
    mac_address = mac_address.replace(":", "-").upper()

    # Get the vendor information from the MAC address
    url = "https://api.macvendors.com/{}".format(mac_address)
    response = requests.get(url)

    # Return the vendor name
    return response.text

# Test the function
print(get_vendor("00:1e:94:05:41:b1"))

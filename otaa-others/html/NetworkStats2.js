import React from 'react'
import "./NetworkStats.css"
import networkServices from "../../../services/network/network.service";

const NetworkStats = () => {
    const [networkStatData, setNetworkStatData] = useState([]);
    
    const getNetworkStatDataByUserId = async () => {
        try {
          const response = await networkServices.getAllNetworkStatByUserId();
          setNetworkStatData(response.data.data);
        } catch (error) {
          console.log(
            `Error Occured in NetworkStats getNetworkStatDataByUserId ${error}`
          );
        }
      };
    
      useEffect(() => {
        getNetworkStatDataByUserId(pageSize, pageNumber);
      }, [pageSize, pageNumber]);

    

    function toggleConversation(row) {
        var nextRow = row.nextElementSibling;
        if (nextRow && nextRow.classList.contains("conversation-row")) {
            if (nextRow.style.display === "none") {
                nextRow.style.display = "table-row";
            } else {
                nextRow.style.display = "none";
            }
        }
    }


    // Load the network graph visualization
    var network_file = "{{ url_for('static', filename='network_graph.html') }}";
    var container = document.getElementById("mynetwork");
    container.innerHTML = '<iframe src="' + network_file + '" style="width:100%;height:100%;border:none;"></iframe>';


  return (
    <div>
    <h1>Packet Summary</h1>
    <table>
        <thead>
            <tr>
                <th>Device A</th>
                <th>Device B</th>
                <th>First Seen Date</th>
                <th>Last Seen Date</th>
                <th>Total Bandwidth</th>
                <th>Protocol</th>
                <th>Port</th>
            </tr>
        </thead>
        <tbody>
            {% for conversation in packet_summary %}
            <tr class="summary-row" onclick="toggleConversation(this)">
                <td>{{ conversation['Device A'] }}</td>
                <td>{{ conversation['Device B'] }}</td>
                <td>{{ conversation['First Seen Date'] }}</td>
                <td>{{ conversation['Last Seen Date'] }}</td>
                <td>{{ conversation['Total Bandwidth'] }}</td>
                <td>{{ conversation['Protocol'] }}</td>
                <td>{{ conversation['Port'] }}</td>
            </tr>
            <tr class="conversation-row">
                <td colspan="7"> <!-- Corrected the colspan to 7 -->
                    <table>
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Source</th>
                                <th>Destination</th>
                                <th>Protocol</th>
                                <th>Source Port</th> <!-- Corrected key to access Source Port -->
                                <th>Destination Port</th> <!-- Corrected key to access Destination Port -->
                            </tr>
                        </thead>
                        <tbody>
                            {% for entry in conversation['Conversation'] %}
                            <tr>
                                <td>{{ entry['Timestamp'] }}</td>
                                <td>{{ entry['Source'] }}</td>
                                <td>{{ entry['Destination'] }}</td>
                                <td>{{ entry['Protocol'] }}</td>
                                <td>{{ entry['Source Port'] }}</td> <!-- Corrected to 'Port' for Source Port -->
                                <td>{{ entry['Destination Port'] }}</td> <!-- Corrected to 'Port' for Destination Port -->
                            </tr>
                            {% endfor %}
                        </tbody>
                    </table>
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>


    <div id="mynetwork"></div>
​
    </div>
  )
}

export default NetworkStats
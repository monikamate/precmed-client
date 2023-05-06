//code to fetch data from reference files from sequencing app
//and display in a table
fetch("http://127.0.0.1:9000/sequencing/references/")
  .then((response) => response.json())
  .then((data) => {
    var table = document.getElementById("reference-tb");
    var dropdown = document.getElementById("ref-dropdown");
    data.forEach((item) => {
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = data.indexOf(item) + 1;
      cell2.innerHTML = item.reference_id;

      //code to display reference file name as a link
      var link = document.createElement("a");
      link.setAttribute("href", item.reference_file);
      link.innerHTML = item.reference_file;
      cell3.appendChild(link);

      //code to add reference file names to dropdown
      var option = document.createElement("option");
      option.text = item.reference_id;
      option.value = item.id;
      dropdown.appendChild(option);
    });
  })
  .catch((error) => console.error(error));

fetch("http://127.0.0.1:9000/sequencing/sequences/")
  .then((response) => response.json())
  .then((data) => {
    var table = document.getElementById("sequence-tb");
    var dropdown = document.getElementById("seq-dropdown");
    data.forEach((item) => {
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      cell1.innerHTML = data.indexOf(item) + 1;
      cell2.innerHTML = item.sample_id;

      //code to display reference file name as a link
      var link = document.createElement("a");
      link.setAttribute("href", item.sequence_data_file);
      link.innerHTML = item.sequence_data_file;
      cell3.appendChild(link);

      //code to add reference file names to dropdown
      var option = document.createElement("option");
      option.text = item.sample_id;
      option.value = item.id;
      dropdown.appendChild(option);
    });
  })
  .catch((error) => console.error(error));

fetch("http://127.0.0.1:9000/sequencing/analysisstatus/")
  .then((response) => response.json())
  .then((data) => {
    var table = document.getElementById("analysis-tb");
    data.forEach((item) => {
      var row = table.insertRow();
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);
      cell1.innerHTML = data.indexOf(item) + 1;
      cell2.innerHTML = item.sequence;
      cell3.innerHTML = item.reference;
      cell4.innerHTML = item.status;

      cell6.innerHTML = item.created_at;
      cell7.innerHTML = item.updated_at;

      //code to display reference file name as a link
      var link = document.createElement("a");
      link.setAttribute("href", item.result_file);
      link.innerHTML = item.result_file;
      cell5.appendChild(link);

      //calculate time taken for analysis
      var date1 = new Date(item.created_at);
      var date2 = new Date(item.updated_at);
      var diff = date2.getTime() - date1.getTime();
      cell8.innerHTML = Math.round(diff / 10) + " milliseconds";
    });
  })
  .catch((error) => console.error(error));

// Attach an event listener to the button
document.getElementById("analyze-btn").addEventListener("click", function () {
  // Define the request URL and payload
  var url = "http://127.0.0.1:9000/sequencing/analyzefiles/";
  var dropdown_seq = document.getElementById("seq-dropdown");

  var dropdown_ref = document.getElementById("ref-dropdown");
  var payload = {
    sequence_id: parseInt(dropdown_seq.value),
    reference_id: parseInt(dropdown_ref.value),
  };

  // Send the POST request using fetch
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    body: JSON.stringify(payload),
  })
    .then(function (response) {
      // Handle the response
      if (response.status == 405) {
        document.getElementById("analyze-msg").innerHTML =
          "Analysis failed - Error in files";
        document.getElementById("alert-box").className = "alert alert-danger";
        console.error("Error:", response);
      } else {
        document.getElementById("analyze-msg").innerHTML = "Analysis started";
        document.getElementById("alert-box").className = "alert alert-success";
        console.log("Response received:", response);
      }
    })
    .catch(function (error) {
      // Handle any errors
      document.getElementById("analyze-msg").innerHTML = error;
      document.getElementById("alert-box").className = "alert alert-danger";
      console.error("Error:", error);
    });
});

//code to upload data

const form = document.querySelector('#uploadForm');
const message = document.querySelector('#message');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(form);

  formData.append('sample_id', numberField);
  formData.append('quality_scores', stringField);

  fetch('/http://127.0.0.1:9000/sequencing/analyzefiles/', {
    method: 'POST',
    body: formData
  })
  .then(response => {
    if (response.ok) {
      message.innerHTML = 'File uploaded successfully';
    } else {
      message.innerHTML = 'Error uploading file';
    }
  })
  .catch(error => {
    message.innerHTML = 'Error uploading file: ' + error.message;
  });
});

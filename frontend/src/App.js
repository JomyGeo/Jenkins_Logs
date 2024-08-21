 import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AnsiUp } from 'ansi_up'; 

const App = () => {
  const [jobOptions, setJobOptions] = useState([]);
  const [selectedJob, setSelectedJob] = useState('');
  const [logs, setLogs] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobOptions = async () => {
      try {
      
        setJobOptions([ 'Core_Integration_BAT_Suite_Cypress'  ,
          'DSAR_BAT_Suite_Cypress',
           'DSD_NonO365_BAT_Suite_Cypress',
          'ECM_BAT_Suite_Cypress',
          'EPM_BAT_Suite_Cypress',
          'ExterroProduction_HappyPath_Standalone',
          'ExterroProduction_HappyPath_Matter',
          'IPP_BAT_Suite_Cypress',
          'Jasper_reports_BAT_Suite_Cypress',
          'LegalHold_BAT_Suite_Cypress',
          'New_Compliance_Portal_BAT_Suite_Cypress',   
          'PRR_BAT_Suite_Cypress',
          'PlatformRefresh_Organization_BAT_suite_Cypress',
          'PlatformRefresh_Matter_BAT_suite_Cypress',
          'Smart_Breach_Review_Corporate_BAT_Suite_cypress',
          'Smart_Breach_Review_Lawfirm_BAT_Suite_cypress',
          '5x_Production_BAT_Suite_cypress']);
      } catch (error) {
        console.error('Error fetching job options:', error);
      }
    };

    fetchJobOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setLogs('');  

    try {
 //    const response = await axios.get(`http://localhost:3000/api/job-status?jobName=${encodeURIComponent(selectedJob)}`);
 const response = await axios.get(`http://localhost:3000/api/latest-build-logs?jobName=${encodeURIComponent(selectedJob)}`);

    // const response = await axios.get(`https://cypress.exterrocloud.info/api/job-status?jobName=${encodeURIComponent(selectedJob)}`);
   // const response = await axios.get(`https://cypress.exterrocloud.info/api/latest-build-logs?jobName=${encodeURIComponent(selectedJob)}`);

      const ansiUp = new AnsiUp(); // Create an instance of AnsiUp
      const ansiHtml = ansiUp.ansi_to_html(response.data.logs);
      setLogs(ansiHtml);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs('Error fetching logs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Jenkins Build Logs</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="job-select">Select Job:</label>
          <select
            id="job-select"
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
          >
            <option value="">--Select a Job--</option>
            {jobOptions.map((job, index) => (
              <option key={index} value={job}>{job}</option>
            ))}
          </select>
        </div>
        <button type="submit">Fetch Logs</button>
      </form>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <pre dangerouslySetInnerHTML={{ __html: logs }} />
      )}
    </div>
  );
};

export default App;





const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3000;

const jenkinsUrl = 'https://newjenkins.exterro.info';
const auth = {
  username: 'jomy.george@exterro.com',
  password: '11b0e02466e6f0a351144d6101ab035b15'
};

app.use(cors());

app.get('/api/latest-build-logs', async (req, res) => {
  const jobName = req.query.jobName; // Get the jobName from the query parameter

  if (!jobName) {
    return res.status(400).send('Job name is required');
  }

  try {
    console.log(`Fetching latest build status for job: ${jobName}`);
    const latestBuildResponse = await axios.get(`${jenkinsUrl}/job/${jobName}/lastBuild/api/json`, { auth });
    const latestBuildNumber = latestBuildResponse.data.number;

    console.log(`Latest build number: ${latestBuildNumber}`);
    console.log('Fetching logs for latest build...');

    // Fetch build logs
    const logsResponse = await axios.get(`${jenkinsUrl}/job/${jobName}/${latestBuildNumber}/logText/progressiveText`, {
      auth,
      responseType: 'arraybuffer',
      responseEncoding: 'binary'
    });

    const logs = Buffer.from(logsResponse.data, 'binary').toString('utf-8');
    res.json({ logs });
  } catch (error) {
    console.error('Error fetching build logs:', error.response ? error.response.data : error.message);
    res.status(error.response ? error.response.status : 500).send('Error fetching build logs: ' + (error.response ? error.response.data : error.message));
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


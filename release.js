require('dotenv').config();

const SftpClient = require('ssh2-sftp-client');
const sftp = new SftpClient();

const localDir = './build'; // Assuming build is the directory you want to send
const remoteDir = '/var/www/cstate.se/a11y-flashcard'; // Replace with your server's directory path

async function upload() {
    try {
        await sftp.connect({
          host: process.env.SFTP_HOST,
          port: process.env.SFTP_PORT || '22', // Use the port from .env or default to 22
          username: process.env.SFTP_USERNAME,
          password: process.env.SFTP_PASSWORD,
        });

        await sftp.uploadDir(localDir, remoteDir);

        console.log('Release uploaded successfully');
    } catch (err) {
        console.error('Error in uploading release:', err);
    } finally {
        await sftp.end();
    }
}

upload();

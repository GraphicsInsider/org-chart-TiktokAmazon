/**
 * @requires child_process
 * @description uploads site code to S3 bucket.
 * 	*	At the end of the npm run build command this cli command gets run to push the static files to the appropriate S3 bucket
 * @see {@link https://awscli.amazonaws.com/v2/documentation/api/latest/reference/s3/index.html#cli-aws-s3} for S3 cli documentation
 */

import { exec } from 'child_process';

const CWD = process.cwd();
const loc = CWD.split('/');
const dir = loc[loc.length - 1]; // current dir
const split = dir.split('-');
const s3Uri = `s3://tbimedia/bistudios/_00/dev_edit/graphics/${split[0]}/${split[1]}/${dir}`;
const s3Url = `https://tbimedia.s3.us-east-1.amazonaws.com/bistudios/_00/dev_edit/graphics/${split[0]}/${split[1]}/${dir}/index.html`;

exec(`aws s3 sync ./build ${s3Uri} --delete --acl private`, (error, stdout, stderr) => {
  if (error) {
    console.log(`error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.log(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}\n✨✨✨  PREVIEW LINK  ✨✨✨\n${s3Url}`);
});
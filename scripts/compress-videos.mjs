import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import path from 'path';
import { fileURLToPath } from 'url';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const videosToCompress = [
  {
    input: path.join(__dirname, '../public/actual-files/outfit1/1.mp4'),
    output: path.join(__dirname, '../public/actual-files/outfit1/1-compressed.mp4'),
  },
  {
    input: path.join(__dirname, '../public/actual-files/outfit2/2.mp4'),
    output: path.join(__dirname, '../public/actual-files/outfit2/2-compressed.mp4'),
  },
  {
    input: path.join(__dirname, '../public/actual-files/outfit3/3.mp4'),
    output: path.join(__dirname, '../public/actual-files/outfit3/3-compressed.mp4'),
  }
];

const compressVideo = (video) => {
  return new Promise((resolve, reject) => {
    console.log(`Starting compression for: ${path.basename(video.input)}`);
    ffmpeg(video.input)
      .output(video.output)
      .videoCodec('libx264')
      .outputOptions([
        '-crf 28',         // Good compression while maintaining quality
        '-preset medium',  // Speed vs compression balance
      ])
      .on('end', () => {
        console.log(`✅ Successfully compressed: ${path.basename(video.output)}`);
        resolve();
      })
      .on('error', (err) => {
        console.error(`❌ Error compressing ${path.basename(video.input)}:`, err);
        reject(err);
      })
      .run();
  });
};

const runAll = async () => {
    for (const v of videosToCompress) {
        await compressVideo(v);
    }
    console.log('All videos compressed successfully.');
};

runAll().catch(console.error);

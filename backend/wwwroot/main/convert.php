<?php
require 'vendor/autoload.php';

$getID3 = new getID3();
$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host'   => 'redis', // ถ้า docker ให้ใส่เป็น redis ถ้าไม่ ใส่ 127.0.0.1 หรือใส่เป็น default ของมันนะ
    'port'   => 6379
]);
echo "Worker started...\n";
echo "Current working directory: " . getcwd();


while (true) {
    $job = $redis->rpop("video_processing_queue");

    if ($job) {
        $data = json_decode($job, true);
        $filePath = "main/" . $data["file_path"];
        $type = $data["type"];
        $dir = "main/" . $data['dir'];
        $ran = $data['path'];
        $filename = $data['filename'];

        $resolutions = [
            '720p' => 1280,
            '480p' => 854,
            '360p' => 640,
        ];

        $heights = [];

        $fileInfo = $getID3->analyze($filePath);
        $mimeType = $fileInfo['mime_type'] ?? null;

        $width = $fileInfo['video']['resolution_x'];
        $height = $fileInfo['video']['resolution_y'];

        foreach ($resolutions as $key => $w) {
            
            $h = round(($w / $width) * $height);
        
            
            if ($h % 2 != 0) {
                $h += 1;
            }
        
            $heights[$key] = $h;
        }
        
        $a = [$resolutions['720p'] . "x" . $heights['720p'], "2500k"];
        $b = [$resolutions['480p'] . "x" . $heights['480p'], "1000k"]; 
        $c = [$resolutions['360p'] . "x" . $heights['360p'], "500k"]; 
        
        
        
        if ($data['upscale'] == 1) {
            exec('ffmpeg -i '. $filePath .' -vf "scale=1920:1080:flags=lanczos" -c:v libx264 -preset slow -crf 18 -c:a aac -b:a 192k '.$dir .$ran.'.mkv');

            // if (file_exists($filePath)) {
            //     unlink($filePath);
            // }
            
            $filePath = $dir. $ran . ".mkv";
          
            
        }
        if ($type == "video/mkv") {
            
            

            $file_name = $ran;
            exec("ffmpeg -i $filePath -crf 27 -preset veryfast ". "-map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 ". "-s:v:0 {$a[0]} -c:v:0 libx264 -b:v:0 {$a[1]} ". "-s:v:1 {$b[0]} -c:v:1 libx264 -b:v:1 {$b[1]} ". "-s:v:2 {$c[0]} -c:v:2 libx264 -b:v:2 {$c[1]} ". "-c:a aac -f hls -hls_playlist_type vod ". "-master_pl_name {$file_name}.m3u8 ". "-hls_segment_filename $dir/{$file_name}_%v/{$file_name}%03d.jpg ". "-var_stream_map \"v:0,a:0,name:720p v:1,a:1,name:480p v:2,a:2,name:360p\" ". "$dir/{$file_name}_%v.m3u8", $out, $f);
            // if (file_exists($filePath)) {
            //     unlink($filePath);
            // }
            
        } else {
            
            
            
            //exec('ffmpeg -i '.$filePath.' -vf scale='. $width .':'. $height .' -start_number 0  -hls_time 3 -hls_list_size 0  -f hls -hls_segment_filename '. $dir . $ran .'_%03d.jpg '. $dir . '/playlist.m3u8');
            // if (file_exists($filePath)) {
            //     unlink($filePath);
            // }

            $file_name = $ran;
            exec("ffmpeg -i $filePath -crf 27 -preset veryfast ". "-map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 -map 0:v:0 -map 0:a:0 ". "-s:v:0 {$a[0]} -c:v:0 libx264 -b:v:0 {$a[1]} ". "-s:v:1 {$b[0]} -c:v:1 libx264 -b:v:1 {$b[1]} ". "-s:v:2 {$c[0]} -c:v:2 libx264 -b:v:2 {$c[1]} ". "-c:a aac -f hls -hls_playlist_type vod ". "-master_pl_name {$file_name}.m3u8 ". "-hls_segment_filename $dir/{$file_name}_%v/{$file_name}%03d.jpg ". "-var_stream_map \"v:0,a:0,name:720p v:1,a:1,name:480p v:2,a:2,name:360p\" ". "$dir/{$file_name}_%v.m3u8", $out, $f);
            
            
        }
        
        echo 'Success ' . $filePath;
        

    }

    sleep(1);
}
?>
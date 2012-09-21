<?php

define('MEDIA_HTTP_PATH', 'http://ec2-23-22-104-252.compute-1.amazonaws.com:1935/vod2/mp4:%s/playlist.m3u8');
define('MEDIA_HTTPS_PATH', 'https://ec2-23-22-104-252.compute-1.amazonaws.com/vod2/mp4:%s/playlist.m3u8');

define('IS_HTTPS_REQUEST', isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on');

class File_Streamer
{
  public $fileName;
  public $contentLength;
  public $path;
  
  public function __construct(){
    if (array_key_exists('HTTP_X_FILE_NAME', $_SERVER) && array_key_exists('CONTENT_LENGTH', $_SERVER)) {
      $this->fileName = $_SERVER['HTTP_X_FILE_NAME'];
      $this->contentLength = $_SERVER['CONTENT_LENGTH'];
    } else throw new Exception("Error retrieving headers");
  }
    
  public function setDestination($p){
    $this->path = $p;
  }
  
  public function receive(){
      if (!$this->contentLength > 0) { throw new Exception('No file uploaded!'); }
      file_put_contents($this->path . $this->fileName, file_get_contents("php://input"));
      return true;
  }
}

$ft = new File_Streamer();
$ft->setDestination('uploaded/');
if($_SERVER['HTTP_HOST'] == 'ec2-23-22-104-252.compute-1.amazonaws.com'){
  $ft->setDestination('/usr/local/WowzaMediaServer-3.1.2/content/');
}

if($ft->receive()){
  die(printf(IS_HTTPS_REQUEST ? MEDIA_HTTPS_PATH : MEDIA_HTTP_PATH, $ft->fileName));
}
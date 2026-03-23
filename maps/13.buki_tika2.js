(function(name,data){
 if(typeof onTileMapLoaded === 'undefined') {
  if(typeof TileMaps === 'undefined') TileMaps = {};
  TileMaps[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }
 if(typeof module === 'object' && module && module.exports) {
  module.exports = data;
 }})("13",
{ "compressionlevel":-1,
 "height":11,
 "infinite":false,
 "layers":[
        {
         "data":[13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13,
            13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13],
         "height":11,
         "id":1,
         "locked":true,
         "name":"yuka",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14,
            14, 14, 0, 0, 0, 0, 0, 0, 0, 14, 14,
            14, 14, 0, 0, 0, 0, 0, 0, 0, 14, 14,
            14, 14, 0, 0, 0, 0, 0, 0, 0, 14, 14,
            14, 14, 0, 0, 0, 0, 0, 0, 0, 14, 14,
            14, 14, 0, 0, 0, 0, 0, 0, 0, 14, 14,
            14, 14, 0, 0, 0, 0, 0, 0, 0, 14, 14,
            14, 14, 14, 0, 0, 0, 0, 0, 14, 14, 14,
            14, 14, 14, 0, 0, 0, 0, 0, 14, 14, 14,
            14, 14, 14, 14, 14, 14, 14, 14, 14, 14, 14],
         "height":11,
         "id":2,
         "locked":true,
         "name":"kabe",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }, 
        {
         "data":[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 10, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         "height":11,
         "id":4,
         "locked":true,
         "name":"takarabako",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":11,
         "x":0,
         "y":0
        }],
 "nextlayerid":6,
 "nextobjectid":1,
 "orientation":"orthogonal",
 "renderorder":"right-down",
 "tiledversion":"1.11.2",
 "tileheight":32,
 "tilesets":[
        {
         "firstgid":1,
         "source":"..\/tile\u30bd\u30d5\u30c8\u30c7\u30fc\u30bf\/machi.tsx"
        }],
 "tilewidth":32,
 "type":"map",
 "version":"1.10",
 "width":11
});
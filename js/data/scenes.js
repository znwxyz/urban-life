/* 배경 11곳: 주택가 7 · 도심 3 · 공원 1. 팔레트는 낮 기준이고 밤·눈은 color.js가 바꾼다.
   - 하늘은 skyTop(위) → skyMid → skyBottom(지평선) 세 색, sunGlow는 해 빛무리 색. 먼 층(far1·far2)은 하늘과 같은 색 계열로 둔다
   - far: 먼 풍경 종류 (apartments · villas · city · trees)
   - wall: 실내면 pattern/run/window, 바깥이면 건물 style
   - floor: 바닥 재질 (paper.js MATERIALS), deco: 바닥 위 표시 (scene.js FLOOR_DECO)
   - items: 크기대별 사물 (s 작은 것 · m 중간 · l 큰 것). 모두 cm로 그려져 동물마다 다른 크기로 보인다 */
const SCENES = {
  villaParking: {
    name: '빌라 주차장', area: '주택가', salt: 1, floor: 'asphalt', deco: 'parkingLines', ceiling: 250, far: 'villas', fg: 'curb',
    items: { s: ['pebble', 'butt', 'leaf'], m: ['box', 'bike', 'trashbag'], l: ['car', 'column'] },
    pal: { skyTop: '#8fbcd2', skyMid: '#cde0dd', skyBottom: '#f7e0c2', sun: '#fff6e2', sunGlow: '#fff0cc', far1: '#9fadbb', far2: '#8693a4',
      wall: '#cbb2a6', wallAlt: '#c2a89c', wallShade: '#8d878b', ceiling: '#aaa4a7', ground: '#8e8a8e',
      groundTop: '#b0acaf', ink: '#3f3b44', light: '#fffaf0', glass: '#a9cbd6', accent: '#e2a35e' },
  },
  aptGarden: {
    name: '아파트 단지 화단', area: '주택가', salt: 2, floor: 'grass', far: 'apartments', fg: 'grass',
    items: { s: ['leaf', 'pebble', 'feather'], m: ['shrub', 'shrub', 'bench'], l: ['tree'] },
    pal: { skyTop: '#93c6dc', skyMid: '#d2e7e2', skyBottom: '#f7ebcb', sun: '#fff8e4', sunGlow: '#fff3cf', far1: '#a9bcc6', far2: '#8ea2b0',
      wall: '#d9d2c4', wallAlt: '#d0c8b8', wallShade: '#b3aa98', ceiling: '#8a9a8a', ground: '#6f9f6c',
      groundTop: '#93bd86', ink: '#2d4a42', light: '#fffbe8', glass: '#a9cbd6', accent: '#f2b56b' },
  },
  recycling: {
    name: '분리수거장', area: '주택가', salt: 3, floor: 'paver', ceiling: 280, far: 'apartments', fg: 'curb',
    items: { s: ['cap', 'pebble', 'butt'], m: ['cardboard', 'trashbag', 'recycleBin'], l: ['recycleBin'] },
    pal: { skyTop: '#9cbad6', skyMid: '#d4dee5', skyBottom: '#f3e1c8', sun: '#fff6e6', sunGlow: '#fff0d2', far1: '#a6b4c3', far2: '#8b9aab',
      wall: '#d8d2c8', wallAlt: '#cec7bc', wallShade: '#6f7a88', ceiling: '#7f8a97', ground: '#8d8f94',
      groundTop: '#abadb2', ink: '#3a3d47', light: '#fffaf2', glass: '#a9cbd6', accent: '#5f8fb0' },
  },
  villaAlley: {
    name: '빌라 골목', area: '주택가', salt: 4, floor: 'asphalt', deco: 'manhole', far: 'villas', fg: 'curb', glow: '#f2a03d',
    wall: { style: 'villa', h: 1000 },
    items: { s: ['butt', 'leaf', 'cap'], m: ['pot', 'trashbag', 'bike'], l: ['pole', 'car'] },
    pal: { skyTop: '#6f80b6', skyMid: '#c3a8c4', skyBottom: '#f8c39c', sun: '#fff0d6', sunGlow: '#ffd9ae', far1: '#9a8bb3', far2: '#7c6c9c',
      wall: '#cf8170', wallAlt: '#c47468', wallShade: '#a55d56', ceiling: '#5f5166', ground: '#5f5166',
      groundTop: '#806d85', ink: '#352a43', light: '#fff0dc', glass: '#8fa9c4', accent: '#f0a35e' },
  },
  entrance: {
    name: '가정집 현관', area: '주택가', salt: 5, floor: 'tileLight', indoor: true, ceiling: 240, glow: '#ffe2a8',
    wall: { pattern: 'plain', run: 'shoeCabinet' }, dens: { l: .3 },
    items: { s: ['pebble', 'crumb'], m: ['shoes', 'umbrella', 'shoes'], l: ['door'] },
    pal: { skyTop: '#e9e2d6', skyBottom: '#f0eae0', sun: '#fffaf0', far1: '#c9d6de', far2: '#aebfcb',
      wall: '#e9e2d6', wallAlt: '#e0d7c8', wallShade: '#c8bca9', ceiling: '#e3dbcd', ground: '#9a958d',
      groundTop: '#bbb5ab', ink: '#3f3a40', light: '#fbf8f2', glass: '#b5ccd6', accent: '#8a9ab0' },
  },
  living: {
    name: '가정집 거실', area: '주택가', salt: 6, floor: 'wood', deco: 'rug', indoor: true, ceiling: 240, glow: '#9fb6ff',
    wall: { pattern: 'stripe', window: true }, dens: { l: .45 },
    items: { s: ['crumb', 'rice'], m: ['cushion', 'box'], l: ['sofa', 'tvstand', 'plant'] },
    pal: { skyTop: '#efe3d3', skyBottom: '#f4ebdf', sun: '#fff4e2', far1: '#c9d6de', far2: '#aebfcb',
      wall: '#efe3d3', wallAlt: '#e8dac8', wallShade: '#d4c0a8', ceiling: '#e9dccb', ground: '#b88a63',
      groundTop: '#d1a57c', ink: '#4b3a40', light: '#fffaf2', glass: '#b7d6e0', accent: '#e08a6c' },
  },
  kitchen: {
    name: '가정집 부엌', area: '주택가', salt: 7, floor: 'wood', indoor: true, ceiling: 240, glow: '#9fb6ff',
    wall: { pattern: 'tile', run: 'counter' }, dens: { l: .35 },
    items: { s: ['crumb', 'rice', 'dropping'], m: ['chair', 'trashcan'], l: ['fridge', 'table'] },
    pal: { skyTop: '#f3e2c4', skyBottom: '#f7ead2', sun: '#fff6e0', far1: '#c9d8dc', far2: '#b1c4cb',
      wall: '#f3e2c4', wallAlt: '#efd9b6', wallShade: '#dcc19a', ceiling: '#e8d5b5', ground: '#c99b72',
      groundTop: '#ddb48a', ink: '#5a4034', light: '#fffaf0', glass: '#a9cfd9', accent: '#8fb8a8' },
  },
  restaurant: {
    name: '식당 주방', area: '도심', salt: 8, floor: 'tileDark', deco: 'drain', indoor: true, ceiling: 260, glow: '#5fa8ff',
    wall: { pattern: 'steel', run: 'steelTable' }, dens: { l: .4 },
    items: { s: ['onion', 'crumb', 'rice'], m: ['bucket', 'crate'], l: ['stove', 'shelf'] },
    pal: { skyTop: '#dfe6e2', skyBottom: '#e8ede9', sun: '#f6f9f7', far1: '#cfe0e6', far2: '#b9c4be',
      wall: '#dfe6e2', wallAlt: '#d3dbd6', wallShade: '#b9c4be', ceiling: '#c9d1cc', ground: '#8f9a96',
      groundTop: '#abb5b1', ink: '#3a4442', light: '#f6f9f7', glass: '#cfe0e6', accent: '#b9c3c7' },
  },
  foodAlley: {
    name: '식당가 뒷골목', area: '도심', salt: 9, floor: 'asphalt', deco: 'manhole', far: 'city', fg: 'curb', glow: '#f2a03d',
    wall: { style: 'concrete', h: 800 },
    items: { s: ['butt', 'cap', 'crumb'], m: ['trashbag', 'crate', 'basin', 'trashbag'], l: ['gasTank', 'pole'] },
    pal: { skyTop: '#55628f', skyMid: '#a68aa8', skyBottom: '#eda283', sun: '#ffe8cc', sunGlow: '#ffcf9e', far1: '#857aa1', far2: '#665c88',
      wall: '#b9a99a', wallAlt: '#ad9c8c', wallShade: '#8d7d70', ceiling: '#5f5a66', ground: '#4f4a55',
      groundTop: '#6f6977', ink: '#2a2532', light: '#ffe9c9', glass: '#f2c27a', accent: '#e0694c' },
  },
  convenience: {
    name: '편의점 앞', area: '도심', salt: 10, floor: 'paver', deco: 'tactile', far: 'city', fg: 'curb', glow: '#fff1cf',
    wall: { style: 'store', h: 1500 },
    items: { s: ['butt', 'cap', 'crumb'], m: ['plasticChair', 'bin'], l: ['parasolTable', 'pole'] },
    pal: { skyTop: '#86b2d2', skyMid: '#cddce4', skyBottom: '#f5dfc5', sun: '#fff7e6', sunGlow: '#fff0d0', far1: '#a2b1c2', far2: '#8797aa',
      wall: '#e9ecef', wallAlt: '#dfe3e6', wallShade: '#c3c9ce', ceiling: '#8a8e96', ground: '#8a8e96',
      groundTop: '#abafb7', ink: '#383c48', light: '#fffdf5', glass: '#cde8e6', accent: '#3f9f7f' },
  },
  park: {
    name: '근린공원', area: '공원', salt: 11, floor: 'grass', far: 'trees', fg: 'grass', glow: '#f2a03d',
    items: { s: ['leaf', 'pebble', 'feather'], m: ['bench', 'shrub'], l: ['tree', 'slide', 'toilet'] },
    pal: { skyTop: '#92c8d2', skyMid: '#d0e6d8', skyBottom: '#f7ecc4', sun: '#fff8e2', sunGlow: '#fff2c8', far1: '#9fbf9f', far2: '#7fa688',
      wall: '#d9cbb8', wallAlt: '#cfc0ab', wallShade: '#b5a690', ceiling: '#5f8a64', ground: '#6f9f6c',
      groundTop: '#93bd86', ink: '#2b4f43', light: '#fffbe8', glass: '#a9cbd6', accent: '#e98a6d' },
  },
};

if (typeof module !== 'undefined' && module.exports) module.exports = { SCENES };

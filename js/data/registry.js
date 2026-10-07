/* 동물 목록. 각 동물 파일이 registerSpecies로 자기를 등록한다 */
const SPECIES = {};

function registerSpecies(sp) {
  if (!sp || !sp.key || !sp.scenes || !sp.endings) throw new Error('잘못된 동물 데이터');
  SPECIES[sp.key] = sp;
}

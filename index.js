//Não precisar de fazer callbacks
const fs = require('fs').promises;

init();

async function init() {
  await createFiles();
  await getMoreOrLessCitiesUf(true);
  await getMoreOrLessCitiesUf(false);
}

async function createFiles() {
  let data = await fs.readFile('./files/Estados.json');
  const states = JSON.parse(data);

  data = await fs.readFile('./files/Cidades.json');
  const cities = JSON.parse(data);
  // forEach - não garante a ordem. for of garante.
  for (state of states) {
    const stateCities = cities.filter((city) => city.Estado === state.ID);
    await fs.writeFile(
      `./states/${state.Sigla}.json`,
      JSON.stringify(stateCities)
    );
  }
}

async function getCitiesCount(uf) {
  const data = await fs.readFile(`./states/${uf}.json`);
  const cities = JSON.parse(data);
  return cities.length;
}

async function getMoreOrLessCitiesUf(more) {
  let states = JSON.parse(await fs.readFile('./files/Estados.json'));
  const list = [];

  for (state of states) {
    const count = await getCitiesCount(state.Sigla);
    list.push({ uf: state.Sigla, count });
  }

  list.sort((a, b) => {
    if (a.count < b.count) return 1;
    else if (a.count > b.count) return -1;
    else return 0;
  });

  const result = [];
  if (more) {
    list
      .slice(0, 5)
      .forEach((item) => result.push(`${item.uf} + ${item.count}`));
  } else {
    list.slice(-5).forEach((item) => result.push(`${item.uf} + ${item.count}`));
  }

  console.log(result);
}

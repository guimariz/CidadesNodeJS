//Não precisar de fazer callbacks
const fs = require('fs').promises;

init();

async function init() {
  await createFiles();
  await getMoreOrLessCitiesUf(true);
  await getMoreOrLessCitiesUf(false);
  await getBiggerOrSmallerNameCities(true);
  await getBiggerOrSmallerNameCities(false);
  await getBiggerOrSmallerCityName(true);
  await getBiggerOrSmallerCityName(false);
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

async function getBiggerOrSmallerNameCities(bigger) {
  const states = JSON.parse(await fs.readFile(`./files/Estados.json`));
  const result = [];
  for (state of states) {
    let city;
    if (bigger) {
      city = await getBiggerName(state.Sigla);
    } else {
      city = await getSmallerName(state.Sigla);
    }

    result.push(`${city.Nome} - ${state.Sigla}`);
  }
  console.log(result);
}

async function getBiggerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) {
      result = city;
    } else if (city.Nome.length > result.Nome.length) {
      result = city;
    } else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    ) {
      result = city;
    }
  });
  return result;
}
async function getSmallerName(uf) {
  const cities = JSON.parse(await fs.readFile(`./states/${uf}.json`));

  let result;

  cities.forEach((city) => {
    if (!result) {
      result = city;
    } else if (city.Nome.length < result.Nome.length) {
      result = city;
    } else if (
      city.Nome.length === result.Nome.length &&
      city.Nome.toLowerCase() < result.Nome.toLowerCase()
    ) {
      result = city;
    }
  });
  return result;
}

async function getBiggerOrSmallerCityName(bigger) {
  const states = JSON.parse(await fs.readFile('./files/Estados.json'));
  const list = [];

  for (state of states) {
    let city;
    if (bigger) {
      city = await getBiggerName(state.Sigla);
    } else {
      city = await getSmallerName(state.Sigla);
    }
    list.push({ name: city.Nome, uf: state.Sigla });
  }

  const result = list.reduce((acc, cur) => {
    if (bigger) {
      if (acc.name.length > cur.name.length) return acc;
      else if (acc.name.length < cur.name.length) return cur;
      else return acc.name.toLowerCase() < cur.name.toLowerCase() ? acc : cur;
    } else {
      if (acc.name.length < cur.name.length) return acc;
      else if (acc.name.length > cur.name.length) return cur;
      else return acc.name.toLowerCase() < cur.name.toLowerCase() ? acc : cur;
    }
  });

  console.log(`${result.name} - ${result.uf}`);
}

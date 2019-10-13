const { table } = require('table');
const path = require('path');
const fs = require('fs');
const stats = getStats();

function getStats() {
  const types = [
    'Max level',
    'Folders',
    'Files',
    'Components',
    '- Componect TypeScript',
    '- Componect HTML',
    '- Componect Style',
    'Directives',
    'Pipes',
    'Modules',
    'Services',
    'State',
    '- Init',
    '- Effects',
    '- Actions',
    '- Adapters',
    '- Reducers',
    '- Selectors',
    'Other',
    '- Other TypeScript',
    '- Other JavaScript',
    '- Other Style',
    'Builder',
    '- Finalized',
    'Images',
    '- PNG',
    '- JPG (JPEG)',
    '- GIF',
  ];
  const nums = {};
  types.forEach(type => nums[type] = {
    amount: 0,
    size: 0
  });

  return {
    types,
    nums
  };
}

function resetStats(statsLocal) {
  statsLocal.types.forEach(type => {
    statsLocal.nums[type].amount = 0;
    statsLocal.nums[type].size = 0;
  });
}

function getStructure(startPoint) {
  // console.log(path.resolve(__dirname, startPoint));

  resetStats(stats);

  const structure = getStructureEntities(startPoint);
  const file = drawLevel(0, structure);

  // console.log(file);
  console.log('---------------------------');
  console.log('STATISTICS FOR:', startPoint);

  const data = [
    ['Name', 'Amount', 'Size (Bytes)'],
    // ['Max level', stats.maxLevel, ''],
    // ['Folders', stats.folders, ''],
    // ['Files', stats.files, formatSize(stats.size)],
    // ['Components:', '', ''],
    // ['- ts', stats.componentsTs, formatSize(stats.sizeTs)],
    // ['- style', stats.componentsStyle, formatSize(stats.sizeStyle)],
    // ['- html', stats.componentsHtml, formatSize(stats.sizeHtml)],
    // ['Directives', stats.directiveTs, formatSize(stats.sizeDirectiveTs)],
    // ['Pipes', stats.pipes, formatSize(stats.sizePipeTs)],
    // ['Services', stats.services, formatSize(stats.sizeServices)],
    // ['Modules', stats.modules, formatSize(stats.sizeModules)],
    // ['State:', '', ''],
    // ['- actions', stats.actions, formatSize(stats.sizeActions)],
    // ['- adapters', stats.adapters, formatSize(stats.sizeAdapters)],
    // ['- effects', stats.effects, formatSize(stats.sizeEffects)],
    // ['- reducers', stats.reducers, formatSize(stats.sizeReducers)],
    // ['- selectors', stats.selectors, formatSize(stats.sizeSelectors)],
    // ['Other:', '', ''],
    // ['- ts', stats.otherTs, formatSize(stats.sizeOtherTs)],
    // ['- js', stats.otherJs, formatSize(stats.sizeOtherJs)],
    // ['- style', stats.otherStyle, formatSize(stats.sizeOtherStyle)],
  ];
  stats.types.forEach(type => data.push([
    type,
    type === 'Components' || type === 'State' || type === 'Other' ? '' : stats.nums[type].amount,
    type === 'Components' || type === 'State' || type === 'Other' || type === 'Max level' || type === 'Folders' ? '' : formatSize(stats.nums[type].size)
  ]));
  const options = {
    columns: {
      0: {
        alignment: 'left'
      },
      1: {
        alignment: 'right'
      },
      2: {
        alignment: 'right',
        width: 18
      }
    },
    drawHorizontalLine: (index, size) => {
      return index !== 5
        && index !== 6
        && index !== 7
        && index !== 13
        && index !== 14
        && index !== 15
        && index !== 16
        && index !== 17
        && index !== 18
        && index !== 20
        && index !== 21
        && index !== 22
        && index !== 24
        && index !== 26
        && index !== 27
        && index !== 28;
    }
  };
  const output = table(data, options);

  console.log(output);

  // fs.writeFile(path.resolve(__dirname, 'report.txt'), file, function(err) {
  //   if (err) {
  //     return console.log(err);
  //   }
  //
  //   console.log('The file was saved!');
  // });
}

function getStructureEntities(startPoint) {
  // console.log('getStructureEntities', startPoint);
  try {
    const entities = fs.readdirSync(path.resolve(__dirname, startPoint));

    if (!entities.length) {
      return [];
    }

    const files = [];
    const folders = [];

    entities.forEach(function(file) {
      const fileStat = fs.lstatSync(path.resolve(__dirname, startPoint, file));

      if (fileStat.isDirectory()) {
        stats.nums['Folders'].amount++;
        folders.push({
          type: 'folder',
          name: file,
          children: []
        });
      } else {
        const isDirective = file.includes('.directive.ts');
        const isPipe = file.includes('.pipe.ts');
        const isComponentTs = file.includes('.component.ts');
        const isComponentStyle = file.includes('.component.scss');
        const isComponentHtml = file.includes('.component.html');
        const isService = file.includes('.service.ts');
        const isModule = file.includes('.module.ts');
        const isInit = file.includes('.init.ts');
        const isEffects = file.includes('.effects.ts');
        const isActions = file.includes('.actions.ts');
        const isAdapter = file.includes('.adapter.ts');
        const isReducer = file.includes('.reducer.ts');
        const isSelector = file.includes('.selector.ts') || file.includes('.selectors.ts');
        const isStyle = file.includes('.scss') || file.includes('.css');
        const isOther = !isDirective
          && !isPipe
          && !isComponentTs
          && !isComponentStyle
          && !isComponentHtml
          && !isService
          && !isModule
          && !isEffects
          && !isActions
          && !isAdapter
          && !isReducer
          && !isSelector;

        if (isDirective) {
          stats.nums['Directives'].amount++;
          stats.nums['Directives'].size += fileStat.size;
        }

        if (isPipe) {
          stats.nums['Pipes'].amount++;
          stats.nums['Pipes'].size += fileStat.size;
        }

        if (isComponentTs) {
          stats.nums['- Componect TypeScript'].amount++;
          stats.nums['- Componect TypeScript'].size += fileStat.size;
        }

        if (isComponentStyle) {
          stats.nums['- Componect Style'].amount++;
          stats.nums['- Componect Style'].size += fileStat.size;
        }

        if (isComponentHtml) {
          stats.nums['- Componect HTML'].amount++;
          stats.nums['- Componect HTML'].size += fileStat.size;
        }

        if (isService) {
          stats.nums['Services'].amount++;
          stats.nums['Services'].size += fileStat.size;
        }

        if (isModule) {
          stats.nums['Modules'].amount++;
          stats.nums['Modules'].size += fileStat.size;
        }

        if (isInit) {
          stats.nums['- Init'].amount++;
          stats.nums['- Init'].size += fileStat.size;
        }

        if (isEffects) {
          stats.nums['- Effects'].amount++;
          stats.nums['- Effects'].size += fileStat.size;
        }

        if (isActions) {
          stats.nums['- Actions'].amount++;
          stats.nums['- Actions'].size += fileStat.size;
        }

        if (isAdapter) {
          stats.nums['- Adapters'].amount++;
          stats.nums['- Adapters'].size += fileStat.size;
        }

        if (isReducer) {
          stats.nums['- Reducers'].amount++;
          stats.nums['- Reducers'].size += fileStat.size;
        }

        if (isSelector) {
          stats.nums['- Selectors'].amount++;
          stats.nums['- Selectors'].size += fileStat.size;
        }

        if (file.includes('.ts') && isOther) {
          stats.nums['- Other TypeScript'].amount++;
          stats.nums['- Other TypeScript'].size += fileStat.size;
        }

        if (file.includes('.js') && isOther) {
          stats.nums['- Other JavaScript'].amount++;
          stats.nums['- Other JavaScript'].size += fileStat.size;
        }

        if (isStyle && isOther) {
          stats.nums['- Other Style'].amount++;
          stats.nums['- Other Style'].size += fileStat.size;
        }

        if (file.includes('.ts') && startPoint.includes('/finalized/')) {
          stats.nums['- Finalized'].amount++;
          stats.nums['- Finalized'].size += fileStat.size;
        }

        if (file.includes('.png')) {
          stats.nums['- PNG'].amount++;
          stats.nums['- PNG'].size += fileStat.size;
        }

        if (file.includes('.jpg') || file.includes('.jpeg')) {
          stats.nums['- JPG (JPEG)'].amount++;
          stats.nums['- JPG (JPEG)'].size += fileStat.size;
        }

        if (file.includes('.gif')) {
          stats.nums['- GIF'].amount++;
          stats.nums['- GIF'].size += fileStat.size;
        }

        stats.nums['Files'].amount++;
        stats.nums['Files'].size += fileStat.size;
        files.push({ type: 'file', name: file, size: fileStat.size });
      }
    });

    folders.forEach(function(folder) {
      folder.children = getStructureEntities(`${startPoint}/${folder.name}`);
    });

    // files.forEach(function (file) {
    //   console.log(`${startPoint}${file}`);
    // });

    return [...folders, ...files];
  } catch (error) {
    console.log('error', error);
    return [];
  }
}

function drawLevel(level, structure) {
  let file = '';

  if (level > stats.nums['Max level'].amount) {
    stats.nums['Max level'].amount = level;
  }

  structure.forEach((entity) => {
    file += `${Array(level + 1).join('- ')}${entity.name}${entity.type === 'folder' ? '/' : ''}` + '\n';
    // console.log(
    //   `${Array(level + 1).join('- ')}${entity.name}${entity.type === 'folder' ? '/' : ''}`,
    //   entity.type === 'folder' ? '' : `- ${formatSize(entity.size ? entity.size : 0)}`
    // );

    if (entity.type === 'folder' && entity.children.length) {
      file += drawLevel(level + 1, entity.children);
    }
  });

  return file;
}

function formatSize(amount, decimalCount = 0, decimal = '.', thousands = ',') {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? '-' : '';
    const i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
    const j = (i.length > 3) ? i.length % 3 : 0;
    const formatted = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : '');

    return `${formatted} bytes`;
  } catch (e) {
    console.log(e);
  }
}

getStructure('apps');
getStructure('libs');
getStructure('apps/fansite');
getStructure('apps/website');
getStructure('apps/website-creator');

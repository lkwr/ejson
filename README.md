### NOTICE: This project is currently experimental and may not work properly!

# EJSON

#### Implementation of Extended JSON (EJSON) in Deno. You can use it for example in MongoDB DataAPI.

![Made for Deno](https://img.shields.io/badge/made%20for-Deno-6B82F6?style=flat-square)
![Licence MIT](https://img.shields.io/github/license/lkwr/ejson?color=blue&style=flat-square)
![Latest version](https://img.shields.io/github/v/tag/lkwr/ejson?color=informational&label=version&sort=semver&style=flat-square)
![Latest commit](https://img.shields.io/github/last-commit/lkwr/ejson?style=flat-square)
![Status WIP](https://img.shields.io/badge/status-WIP-red?style=flat-square)

## Key Features

- Made for [Deno](https://deno.land)
  - works with [Deno Deploy](https://deno.com/deploy)
- Pure Typescript
- Lightweight
- Extendable
- Zero _third party_ dependencies (only deno_std)

## How To Use

Currently there are no built-in types. But this is planned for the future but
until then you can implement it yourself (or open a merge request 🤠 )

```ts
import * as EJSON from 'https://deno.land/x/ejson/mod.ts';
import * as Base64 from 'https://deno.land/std@0.135.0/encoding/base64.ts';

// Add date extention
EJSON.addEncoder(Date, (date) => {
    return { $date: { $numberLong: date.getTime().toString() } };
});
EJSON.addDecoder('$date', (obj) => {
    const num = Number.parseInt(obj.$numberLong);
    return new Date(num);
});

// Add Uint8Array extention
EJSON.addEncoder(Uint8Array, (buffer) => {
    return { $binary: { base64: Base64.encode(buffer) } };
});
EJSON.addDecoder('$binary', (obj) => {
    return Base64.decode(obj.base64);
});

const obj = [new Date(), { myBin: new Uint8Array([0xff, 0x7f]) }];
console.log('obj', obj);
// obj [ 2022-04-15T18:06:07.820Z, { myBin: Uint8Array(2) [ 255, 127 ] } ]

const stringified = EJSON.stringify(obj);
console.log('stringified', stringified);
// stringified [{"$date":{"$numberLong":"1650045944276"}},{"myBin":{"$binary":{"base64":"/38="}}}]

const parsed = EJSON.parse(stringified);
console.log('parsed', parsed);
// parsed [ 2022-04-15T18:06:00.332Z, { myBin: Uint8Array(2) [ 255, 127 ] } ]
```

## TODO

- add built-in types

## Known issues

--

## Contributing

Feel free to open merge requests!

## License

MIT

---

> Homepage [luke.id](https://luke.id) &nbsp;&middot;&nbsp; GitHub
> [@lkwr](https://github.com/lkwr) &nbsp;&middot;&nbsp; Twitter
> [@wlkrlk](https://twitter.com/wlkrlk)

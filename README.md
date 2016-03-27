
# Github Weekly Report

Generate weekly report for your Github organization.

## Usage

First of all, you need to config your client:

```sh
$ github-weekly-report
github-weekly-report> config
```

Then just follow the tips by github-weekly-report to input the below information:

- Personal Github Token
- Your Github Username
- Your oganization name

Thus you can

```sh
github-weekly-report> report
```

Finally you will get your team summary of this week like this:

```txt
16/03/21 - 16/03/27 Developers Ranking
┌───┬──────────────┬─────────────┐
│   │ name         │ contributes │
├───┼──────────────┼─────────────┤
│ 1 │ yorkie       │ 48050       │
├───┼──────────────┼─────────────┤
│ 2 │ jkvim        │ 11800       │
├───┼──────────────┼─────────────┤
│ 3 │ scottoasis   │ 4450        │
├───┼──────────────┼─────────────┤
│ 4 │ nickleefly   │ 500         │
├───┼──────────────┼─────────────┤
│ 5 │ Xidai        │ 300         │
├───┼──────────────┼─────────────┤
│ 6 │ huangciyin   │ 50          │
├───┼──────────────┼─────────────┤
│ 7 │ chano        │ 50          │
├───┼──────────────┼─────────────┤
│ 8 │ wanglin02    │ 50          │
├───┼──────────────┼─────────────┤
│ 9 │ letmeknowhow │ 50          │
└───┴──────────────┴─────────────┘
```

## Installation

```sh
$ npm install github-weekly-report -g
```

## License

MIT

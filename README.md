# H5P Attention Seeker
Help to seek users' attention.

## Getting started
Clone this repository with git and check out the branch that you are interested
in (or choose the branch first and then download the archive, but learning
how to use git really makes sense).

Change to the repository directory and run
```bash
npm install
```

to install required modules. Afterwards, you can build the project using
```bash
npm run build
```

or, if you want to let everything be built continuously while you are making
changes to the code, run
```bash
npm run watch
```
Before putting the code in production, you should always run `npm run build`.

The build process will transpile ES6 to earlier versions in order to improve
compatibility to older browsers. If you want to use particular functions that
some browsers don't support, you'll have to add a polyfill.

The build process will also move the source files into one distribution file and
minify the code.

## Functions

### register(params)
where the params property `element` is the HTML element that the effect should
be attached to, `style` is the name of the style to use, currently:
  - bounce
  - flash
  - focus
  - heartbeat
  - highlight
  - pulse
  - rubberband
  - shakex
  - tada
  - wobble

You can also use the params property `interval` to set the time interval
between two attention seeker triggers in ms (default 10000), and you can set
`repeat` to set the number of triggers before the attention seeker is removed
(default 1). The function will return a unique it to identify the attention
seeker worker process. The worker process will end and remove itself after all
triggers have been finished.

Will trigger a `started` event on the attentionSeeker instance giving the id
of the process that just started the effect as data.

Will trigger a `ended` event on the attentionSeeker instance giving the id
of the process that just ended the effect as data.

### unregister(id)
Unregister an attention seeker with id `id`. Will remove all traces of the
attention seeker. Will trigger an `removed` event on the attentionSeeker
instance giving the id as data.

### unregisterAll()
Unregister all attention seekers Will remove all traces of the attention
seekers. Will trigger an `removed` events on the attentionSeeker instance
each giving the id as data.

### run(id)
Will run the worker with id `id`.

### pause(id)
Will pause the worker with id `id`.

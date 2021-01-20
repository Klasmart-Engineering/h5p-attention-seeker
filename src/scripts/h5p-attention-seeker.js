import AttentionSeekerWorker from './h5p-attention-seeker-worker';

export default class AttentionSeeker extends H5P.EventDispatcher {
  /**
   * @constructor
   */
  constructor() {
    super();

    this.workers = [];
  }

  /**
   * Register worker.
   * @param {object} params Worker parameters.
   * @param {HTMLElement} params.element Element to attach effect to.
   * @param {string} params.style Style for effect.
   * @param {number} params.interval Default interval for triggering.
   * @param {number} params.repeat Default number of repetitions.
   * @return {number} id New worker id.
   */
  register(params) {
    if (!params.element) {
      return;
    }

    // Determine next id
    const nextId = (this.workers.length === 0) ?
      0 :
      this.workers[this.workers.length - 1].id + 1;

    const worker = new AttentionSeekerWorker({
      id: nextId,
      element: params.element,
      style: params.style,
      interval: params.interval,
      repeat: params.repeat
    }, {
      onAnimationStarted: (id) => {
        this.handleAnimationStarted(id);
      },
      onAnimationEnded: (id) => {
        this.handleAnimationEnded(id);
      },
      onWorkerRemoved: (id) => {
        this.handleWorkerRemoved(id);
      }
    });

    this.workers.push({
      id: nextId,
      worker: worker
    });

    if (params.options && params.options.runWorker) {
      worker.run();
    }

    return nextId;
  }

  /**
   * Unregister worker.
   * @param {number} id Id of worker tp be unregistered.
   */
  unregister(id) {
    if (typeof id !== 'number' || id < 0) {
      return;
    }

    const workers = this.workers.filter(worker => worker.id === id);

    if (workers.length > 0) {
      workers[0].worker.remove();
      this.workers = this.workers.filter(worker => worker.id !== id);
    }
  }

  /**
   * Unregister all workers.
   */
  unregisterAll() {
    this.workers.forEach(worker => {
      worker.worker.remove(worker.id);
    });
  }

  /**
   * Run a worker.
   * @param {number} id Id of worker to run.
   */
  run(id) {
    if (typeof id !== 'number' || id < 0) {
      return;
    }

    const workers = this.workers.filter(worker => worker.id === id);
    if (workers.length > 0) {
      workers[0].worker.run();
      this.handleWorkerRun(id);
    }
  }

  /**
   * Pause a worker.
   * @param {number} id Id of worker to pause.
   */
  pause(id) {
    if (typeof id !== 'number' || id < 0) {
      return;
    }

    const workers = this.workers.filter(worker => worker.id === id);
    if (workers.length > 0) {
      workers[0].worker.pause();
      this.handleWorkerPause(id);
    }
  }

  /**
   * Handle worker started animation.
   * @param {number} id Id of worker that started animation.
   */
  handleAnimationStarted(id) {
    this.trigger('started', id);
  }

  /**
   * Handle worker ended animation.
   * @param {number} id Id of worker that has ended animation.
   */
  handleAnimationEnded(id) {
    this.trigger('ended', id);
  }

  /**
   * Handle worker started running.
   * @param {number} id Id of worker that started running.
   */
  handleWorkerRun(id) {
    this.trigger('run', id);
  }

  /**
   * Handle worker paused.
   * @param {number} id Id of worker that paused.
   */
  handleWorkerPause(id) {
    this.trigger('pause', id);
  }

  /**
   * Handle worker removed.
   * @param {number} id Id of worker that has been removed.
   */
  handleWorkerRemoved(id) {
    this.workers = this.workers.filter(worker => worker.id !== id);
    this.trigger('removed', id);
  }
}

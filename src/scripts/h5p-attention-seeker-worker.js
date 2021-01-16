import "../styles/h5p-attention-seeker-bounce.scss";
import "../styles/h5p-attention-seeker-flash.scss";
import "../styles/h5p-attention-seeker-focus.scss";
import "../styles/h5p-attention-seeker-heartbeat.scss";
import "../styles/h5p-attention-seeker-highlight.scss";
import "../styles/h5p-attention-seeker-pulse.scss";
import "../styles/h5p-attention-seeker-rubberband.scss";
import "../styles/h5p-attention-seeker-shakex.scss";
import "../styles/h5p-attention-seeker-tada.scss";
import "../styles/h5p-attention-seeker-wobble.scss";

import Util from './h5p-attention-seeker-util';

export default class AttentionSeekerWorker {
  /**
   * @constructor
   * @param {object} params Parameters passed by the editor.
   * @param {number} params.id Id assigned by attention seeker.
   * @param {HTMLElement} params.element Element to attach effect to.
   * @param {string} [params.style='bounce'] Style for effect.
   * @param {number} [params.interval=10000] Default interval for triggering.
   * @param {number} [params.repeat=1] Default number of repetitions.
   */
  constructor(params, callbacks) {
    if (typeof params.id !== 'number' || params.id < 0 || !params.element) {
      return null;
    }

    // Default values
    this.params = Util.extend({
      style: 'bounce',
      interval: 10000, // ms
      repeat: 1
    }, params);

    // Default callbacks
    this.callbacks = callbacks || {};
    this.callbacks.onAnimationStarted = callbacks.onAnimationStarted || (() => {});
    this.callbacks.onAnimationEnded = callbacks.onAnimationEnded || (() => {});
    this.callbacks.onWorkerRemoved = callbacks.onWorkerRemoved || (() => {});

    // Track whether worker has been registered
    this.isRegistered = false;

    // Classes for element
    this.params.element.classList.add(`h5p-attention-seeker`);
    this.params.element.classList.add(`h5p-attention-seeker-${this.params.style}`);

    // Highlighting element, needs to be made visible, styled and animated by CSS
    this.highlightElement = document.createElement('div');
    this.highlightElement.classList.add('h5p-attention-seeker-highlight-element');
    this.params.element.appendChild(this.highlightElement);
  }

  /**
   * Run worker.
   */
  run() {
    if (this.params.repeat <= 0) {
      return;
    }

    // Detect animation end once only
    if (!this.isRegistered) {
      this.params.element.addEventListener('animationend', (event) => {
        if (event.animationName !== this.params.style) {
          return;
        }

        this.ended();
      });
      this.isRegistered = true;
    }

    clearTimeout(this.currentTimeout);
    this.currentTimeout = setTimeout(() => {
      // Start animation
      this.started();

      this.params.repeat--;

      if (this.params.repeat > 0) {
        this.run();
      }
    }, this.params.interval);
  }

  /**
   * Pause worker.
   */
  pause() {
    clearTimeout(this.currentTimeout);

    // End ongoing animation
    if (this.params.element.classList.contains('h5p-attention-seeker-animation')) {
      this.ended();
    }
  }

  /**
   * Remove worker traces.
   */
  remove() {
    clearTimeout(this.currentTimeout);

    if (this.params.element.classList.contains('h5p-attention-seeker-animation')) {
      this.ended();
    }

    // Remove DOM traces
    this.params.element.classList.remove(`h5p-attention-seeker`);
    this.params.element.classList.remove(`h5p-attention-seeker-${this.params.style}`);
    this.params.element.removeChild(this.highlightElement);

    this.callbacks.onWorkerRemoved(this.params.id);
  }

  /**
   * Claim animation started.
   */
  started() {
    this.params.element.classList.add('h5p-attention-seeker-preparation');
    this.callbacks.onAnimationStarted(this.params.id);

    setTimeout(() => {
      this.params.element.classList.add('h5p-attention-seeker-animation');
    }, 0);
  }

  /**
   * Claim animation ended.
   */
  ended() {
    this.params.element.classList.remove('h5p-attention-seeker-preparation');
    this.params.element.classList.remove('h5p-attention-seeker-animation');

    this.callbacks.onAnimationEnded(this.params.id);

    if (this.params.repeat <= 0) {
      this.remove();
    }
  }
}

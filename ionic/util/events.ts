import {Injectable} from 'angular2/angular2';

/**
 * Event is a pub/sub style event system for sending and responding to application-level
 * events across your app.
 */
@Injectable()
export class Events {
  constructor() {
    console.log('Events constructed');
    this.channels = [];
  }

  /**
   * Subscribe to an event topic. Events that get posted to that topic
   * will trigger the provided handler.
   *
   * @param topic the topic to subscribe to
   * @param handler the event handler
   */
  subscribe(topic, ...handlers) {
    if(!this.channels[topic]) {
      this.channels[topic] = [];
    }
    handlers.forEach((handler) => {
      this.channels[topic].push(handler);
    });
  }

  /**
   * Unsubscribe the given handler from the given topic. Your handler will
   * no longer receive events published to this topic.
   *
   * @param topic the topic to unsubscribe from
   * @param handler the event handler
   */
  unsubscribe(topic, handler) {
    var t = this.channels[topic];
    if(!t) {
      return null;
    }

    t.splice(t.indexOf(handler), 1);

    // If the channel is empty now, remove it from the channel map
    if(!t.length) {
      delete this.channels[topic];
    }

    return true;
  }

  /**
   * Publish an event to the given topic.
   *
   * @param topic the topic to publish to
   * @param eventData the data to send as the event
   */
  publish(topic, ...args) {
    var t = this.channels[topic];
    if(!t) {
      return null;
    }

    let responses = [];
    t.forEach((handler) => {
      responses.push(handler(args));
    });
    return responses;
  }
}

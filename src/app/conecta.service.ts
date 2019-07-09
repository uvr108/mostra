import { Injectable, ErrorHandler } from '@angular/core';
import { Observable, Subject, of } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { map } from 'rxjs/operators';
const URL = 'ws://10.54.218.167:8765/';
import { Message } from './message';

@Injectable()
export class ConectaService {
    // public messages: Subject<Message>;
    public stream_msg: Subject<Message> = new Subject<Message>();

    // private msg = { command: 'sumar', message: '[1,2,3,4]' };

    constructor(wsService: WebsocketService) {

    /* Creating observable Subject Message Event from wsService */
    const wsSubject = wsService.connect(URL);
    /* Transform Subject Message Evento into Message */
    this.stream_msg = <Subject<Message>>wsSubject.pipe(map(
      (response: MessageEvent): Message => {
        const data = JSON.parse(response.data);
        return data;
      }
      ));
 }

  send(msg: Message) {
    console.log('send ok');
    // console.log(JSON.stringify(msg));
    
    this.stream_msg.next(msg);


  }


}

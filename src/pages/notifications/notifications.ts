import {Component} from '@angular/core';
import {Events} from 'ionic-angular';

/*
 Generated class for the Notifications page.

 See http://ionicframework.com/docs/v2/components/#navigation for more info on
 Ionic pages and navigation.
 */
@Component({
    selector: 'page-notifications',
    templateUrl: 'notifications.html'
})
export class NotificationsPage {
    private messages: any = [];

    constructor(private events: Events) {
    }

    ngAfterContentInit() {

        this._GetPushes();
    }

    private _GetPushes() {
        this.events.subscribe('message:new', (res) => {
            this.messages.push(res);
            console.info(res, this.messages, '111111111111111111111')
        });
    }
    private _Remove(i){
        this.messages.splice(i,1)
    }

}

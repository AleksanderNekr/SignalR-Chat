import { DomSanitizer } from '@angular/platform-browser';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, SecurityContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { SignalrService } from "./services/signalr.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, ReactiveFormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  title = 'chat-client';

  messages: Message[] = [];
  private _user = '';

  inputNameForm = new FormGroup({
    'user': new FormControl('', Validators.required)
  });
  sendMessageForm = new FormGroup({
    'text': new FormControl('', Validators.required)
  });

  constructor(private readonly chatService: SignalrService,
              private readonly changeDetector: ChangeDetectorRef,
              private readonly sanitizer: DomSanitizer) {
  }

  ngOnInit() {
    this.chatService.startConnection();
    this.chatService.addChatMsgListener((user, text) => {
      this.messages.push({ user, text });
      this.changeDetector.detectChanges();
    });
  }

  public sendMessage() {
    let text = this.sendMessageForm.get('text')?.value ?? '<empty>';
    text = this.sanitizer.sanitize(SecurityContext.HTML, text) || '';
    this.chatService.sendMessage(this.user, text, () => {
      alert('Error while trying sending message! Try again later');
      this.ngOnInit();
    });
    this.sendMessageForm.reset();
  }

  set user(value: string | null | undefined) {
    if (this._user !== value) {
      this._user = value ?? '<empty>';
      this.changeDetector.detectChanges();
    }
  }

  get user(): string {
    return this._user;
  }

  saveUser() {
    this.user = this.inputNameForm.get('user')?.value;
  }
}

interface Message {
  user: string
  text: string
}

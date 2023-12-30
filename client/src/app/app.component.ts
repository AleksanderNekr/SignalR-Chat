import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { SignalrService } from "./services/signalr.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, RouterOutlet, FormsModule, ReactiveFormsModule ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {
  protected title = 'chat-app';
  protected messages: Message[] = [];
  protected text: string = '';
  protected user: string = '';

  inputNameForm: FormGroup = new FormGroup({
    'user': new FormControl('', Validators.required)
  })
  sendMessageForm: FormGroup = new FormGroup({
    'text': new FormControl('', Validators.required)
  })

  constructor(private readonly chatRService: SignalrService, private readonly ref: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.chatRService.startConnection()
    this.chatRService.addChatMsgListener((user, text) => {
      this.messages.push({ user, text })
      this.ref.markForCheck()
    })
  }

  public sendMessage() {
    this.text = this.sendMessageForm.get('text')?.value
    this.chatRService.sendMessage(this.user, this.text)
    this.sendMessageForm.reset()
    console.log(`Message ${ this.user }, ${ this.text } sent!`)
  }

  saveUser() {
    this.user = this.inputNameForm.get('user')?.value
    console.log("User saved: " + this.user)
    this.ref.markForCheck()
  }
}

interface Message {
  user: string
  text: string
}


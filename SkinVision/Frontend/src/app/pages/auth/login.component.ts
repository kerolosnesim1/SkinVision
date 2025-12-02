import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <div class="login-container">
      <h2>Login</h2>
      <form>
        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" placeholder="Enter email">
        </div>
        <div class="form-group">
          <label>Password</label>
          <input type="password" [(ngModel)]="password" name="password" placeholder="Enter password">
        </div>
        <button type="submit">Sign In</button>
      </form>
      <p><a routerLink="/">Back to home</a></p>
    </div>
  `,
  styles: [`
    .login-container {
      max-width: 400px;
      margin: 50px auto;
      padding: 30px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    h2 {
      text-align: center;
      margin-bottom: 30px;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    input {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      width: 100%;
      padding: 10px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:hover {
      background: #218838;
    }
    p {
      text-align: center;
      margin-top: 15px;
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
}


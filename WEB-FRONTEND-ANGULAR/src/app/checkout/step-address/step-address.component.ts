import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-step-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step-address.component.html',
  styleUrls: ['./step-address.component.scss']
})
export class StepAddressComponent {
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();   // ✅ novo evento
  @Output() addressData = new EventEmitter<any>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      rua: [''],
      numero: [''],
      cidade: [''],
      estado: ['']
    });
  }

  submit() {
    if (this.form.valid) {
      this.addressData.emit(this.form.value);
      this.next.emit();
    }
  }

  goBack() {
    this.back.emit();
  }
}

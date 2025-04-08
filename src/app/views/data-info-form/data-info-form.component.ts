import { Component } from '@angular/core';
import { DataInfoService, DataInfo } from '../../services/data-info.service';

@Component({
  selector: 'app-data-info-form',
  templateUrl: './data-info-form.component.html',
  styleUrls: ['./data-info-form.component.css']
})
export class DataInfoFormComponent {
  formData: DataInfo = {
    data: '',
    info: '',
    icono: ''
  };

  iconList: string[] = [
    'phone', 'email', 'location_on', 'facebook', 'smartphone', 'language', 'person'
  ];

  constructor(private dataInfoService: DataInfoService) {}

  selectIcon(icon: string) {
    this.formData.icono = icon;
  }

  onSubmit() {
    this.dataInfoService.create(this.formData).subscribe({
      next: (res) => {
        console.log('Guardado:', res);
        alert('Dato guardado con éxito');
        this.formData = { data: '', info: '', icono: '' };
      },
      error: (err) => {
        console.error('Error:', err);
        alert('Error al guardar');
      }
    });
  }
}

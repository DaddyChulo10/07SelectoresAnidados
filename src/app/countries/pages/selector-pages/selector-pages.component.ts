import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/coutry.interfaces';
import { Observable, count, filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styleUrls: ['./selector-pages.component.css']
})
export class SelectorPagesComponent implements OnInit {

  constructor(private fb: FormBuilder, private countriesService: CountriesService) { }


  public countriesByRegion: SmallCountry[] = []

  public borders: SmallCountry[] = []

  public myForm: FormGroup = this.fb.group({
    region: ['', Validators.required],
    country: ['', Validators.required],
    border: ['', Validators.required],
  })

  ngOnInit(): void {
    this.onRegionChanged()
    this.onCountryChanged()
  }

  get regions(): Region[] {
    return this.countriesService.regions;
  }

  onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('country')!.setValue('')),
        tap(() => this.borders = []),
        switchMap(region => this.countriesService.getCountriesByRegion(region))
      )
      .subscribe(countries => {
        this.countriesByRegion = countries
        // console.log({ countries })
      })
  }

  onCountryChanged(): void {
    this.myForm.get('country')!.valueChanges
      .pipe(
        tap(() => this.myForm.get('border')!.setValue('')),
        filter((value: string) => value.length > 0),
        switchMap(alphaCode => this.countriesService.getCountryByAlphaCode(alphaCode)),
        switchMap(country => this.countriesService.getCountryBordersByCodes(country.borders))
      )
      .subscribe(countries => {
        // this.countriesByRegion = countries
        this.borders = countries
        // console.log({ borders: countries })
      })
  }




}

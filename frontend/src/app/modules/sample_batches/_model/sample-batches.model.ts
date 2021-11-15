export enum SampleBatchesState {
  STATE_ONE = "En procesamiento",
  STATE_TWO = "Procesado"
}


export interface Sample{
  id: number,
  ml_extracted: number,
  freezer_number: number,
  study_id: number,
  picked_up_by:string,
  picked_up_date: string,
  sample_batch_id: number,
  paid: boolean
  
}


export interface SampleBathes{
  id: number,
  created_date: string,
  current_state: string,
  samples: Sample[]
  
}

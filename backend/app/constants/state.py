class StudyState:
    """
    Constants for the various states of a study
    """

    STATE_ONE = "Esperando comprobante de pago"
    STATE_ONE_ERROR = "Anulado por falta de pago"
    STATE_TWO = "Esperando enviar consentimiento"
    STATE_THREE = "Esperando consentimiento firmado"
    STATE_FOUR = "Esperando selección de turno"
    STATE_FIVE = "Esperando toma de muestra"
    STATE_SIX = "Esperando retiro de muestra"
    STATE_SEVEN = "Esperando lote de muestra"
    STATE_EIGHT = "Esperando resultado biotecnológico"
    STATE_NINE = "Esperando interpretación de resultados e informes"
    STATE_TEN = "Esperando ser entregado a médico derivante"
    STATE_ENDED = "Resultado entregado"


class SampleBatchState:

    STATE_ONE = "En procesamiento"
    STATE_TWO = "Procesado"
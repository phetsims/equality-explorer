/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';

const image = new Image();
const unlock = simLauncher.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA+FJREFUeNrMmllIVVEUho+mlZWRNmhG0YyNJgYFFTQ+RARFA2QvpRVRIQRFUA8NQgU9BVlB1ENRD0U9VC9SRhnNgxGlWCpkFtpgZVKmpf0L/wu7673HM+x9bMGHXj377vvvYa21176WZd4ywSnwAbSBVyBbdycxBgUkgV0gh7+r1gTywEcwFaSAP6AGPAL3wTfrP7AsUMoZ8EI12A16d6WIGeCzDxEqMjsju0LEUPBek4gQL0H/oIWc0ywixNEgRYwCvwwJ+Q4G23Ueq1FIOuhuaJD6gAy7B7pp7KwH2GRwxuPBWzqS3yaFSMBLBtMMCZkI1oGVnJ1E0AwaGYO0B9g8JYqbRvZkOdhmahkMA4cZwYMQVG/ak90IamZiDQt5GJDrrzct5DxHzLRdDGK0zhheVlUgNQghaaDBkIgXdMu255GeDHI6zgUFLoOleLs9oBa0ggQwgN5QEtNeoBAcB1/t3kimar/GrHMM+OlytAv8dprC1Hmt5iX22MPSWey1s37gKSgzcAy+6kFIKZe4JzfWZqI4ALvmcUNvdNvRZjasYUKm02Sm6zwKqeDmdmSpzFfa6Al02xafbjbHaUf7lEZLNYsYQjfqR0gFXbCt9QWv2UBc5HCNIqTzmz5FnAV7wYjOOlvCoCONKhkEdZjUpC5riN4lTj3oEaXRPU0iZFZvaRCRD+Y7yaXiwCTldbMGEavAIe4NvyapynWnD5eHVfa8muy105qTwjtuArMq5B1LL24tlctSd3bb0Fk9S7XbSkOpRkxxKSLJkIgQGU4+RCzzKvX1Qhci4lgmnW7wPJPs9MHVYSNQ5qJiuDOAwoLjgU3h3lAbb3DQbjSLY6aFLHczfSfCGtfxJGZnxwIq9SxzIyRLie4himyW2CAlyTRNttPNLvaEOY1qc632S8y4CO0WWR3vBU1ZgtsGaRH2inCJ5wnVLgQ0G65SeNUWME2JlLhlKS63KkAhuV6nUtZkS4Q3FA+1HUz2UBHxw1Y/61I8xY8ob1zLDED3B67kzIf//aDfTTbPar/QD2rk54SdVENc0eExJMV/ZliALNn17G9NhP9/ArO9loXCk0KThWj5lkOmMnDRlq2kTit0zE6uhiJCNKS+PJYesczmOQnasyJ9ODeXoSW870ik59J5txIqlhcxNZoZ5bkYPlcYLbI7tWqu53wDEbyJP09a7Zec0azG74yo9gAM5Lm8lXmXBEn5etJd8Nxqv9lt4Sbt7FhQynjRyPeqZtEhvKJTDHYoov+ZKr+HngQGyC9Wx2u2eKY+43j4kvU9gUcHGYA3dK8HuP9UG8/Nnc4ZKuYhrinSB/krwAAkba+rpZSyrwAAAABJRU5ErkJggg==';
export default image;
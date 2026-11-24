// pages.merakipokerteam.com.br/quiz/ → projeto meraki-poker-quiz (repositório Claudev4mundim/meraki-poker-quiz)
import { encaminhar } from '../../lib/encaminhar.js';

export const onRequest = encaminhar('/quiz', 'https://meraki-poker-quiz.pages.dev');

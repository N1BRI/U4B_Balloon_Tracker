
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { balloonTelemetry } from '../stores.js';



const w1nrg = {
        callsign: 'W1NRG',
        slotId: 6,
        telCallFormat: '1_6',
        startDate: new Date('09/02/2023')
}

const balloonConfigSchema = z.object({
    callsign: z.string().min(4).max(7).toUpperCase(),
    telCallFormat: z.string().regex(/^[0-9]_[0-9]$/, "Invalid format. Please ensure input is n_n where n=0-9"),
    slotId: z.number().min(0).max(9),
    startDate: z.date().default(new Date())
});

export const actions = {
    balloon: async ({ request }) => {
        const formData = await request.formData();
        const balloonConfigFormData = formDataToBalloonConfigFormData(formData);
        balloonTelemetry.set([]);

        const result = balloonConfigSchema.safeParse(balloonConfigFormData);
        if (result.success) {
            return { success: true, formData: balloonConfigFormData }
        }
        else {
            const { fieldErrors: errors } = result.error.flatten();

            return fail(400, { errors, formData: balloonConfigFormData });

        }
        
    },
    w1nrg: async ({ request }) =>{
        balloonTelemetry.set([]);
        return { success: true, formData: w1nrg }    
    }
}





/**
 * @param {{ get: (arg0: string) => any; }} formData
 */
function formDataToBalloonConfigFormData(formData) {
    return {
        callsign: formData.get('callsign').toUpperCase(),
        slotId: parseInt(formData.get('slotId')),
        telCallFormat: formData.get('telCallFormat'),
        startDate: new Date(formData.get('startDate'))
    }
}


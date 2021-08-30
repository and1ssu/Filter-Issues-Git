import React from 'react';
import Dashboard from './Dashboard';
import { render, screen} from '@testing-library/react';




describe('Teste Dashboard component', () =>{
    test('Teste Issues Abertas e Fechadas ', async ()  =>{
        render(<Dashboard/>)
        const dashboardText = screen.getByText('Linhas')

        expect(dashboardText).toBeInTheDocument();

    });
   
});
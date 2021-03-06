const defaultOptions = {
    decimal: 0
};

function calculateDREBalance(data = {}, options) {
    const result = Object.assign({}, data);
    options = options || defaultOptions;

    result.growth = calcGrowth(data.net_income_year_before, data.net_income);

    result.gross_result = calcGrossResult(data.net_income, data.sold_product_cost);

    result.operational_result = calcOperationalResult(result.gross_result, data.adm_cost, data.sell_team_cost, data.op_cost);

    result._ebitda = calcEbitda(result.operational_result, data.depreciation);

    result.liquid_profit_before_ir = calcLiquidProfitBeforeIR(result.operational_result, data.financial_result, data.rev_exp_no_rec, data.other);

    result.liquid_profit = calcLiquidProfit(result.liquid_profit_before_ir, data.exp_ir_csll);

    result.total_tax_liability = calcTotalTaxLiability(data.taxes_cp, data.taxes_lp);

    result.liquid_debit = calcLiquidDebit(data.cash_availability, data.onerous_liability_cp, data.onerous_liability_lp, data.adjust_liquid_debit);

    result.liquid_debit_with_liability = calcLiquidDebitWithLiability(result.liquid_debit, result.total_tax_liability);

    result.k_variation = calcKVariation(data.customer_receive_year_before, data.stock_year_before, data.bills_pay_before, data.customer_receive, data.stock, data.bills_pay);

    result.additional_leverage_total = calcAdditionalLeverage(data.leverage_quotient, data.target_value);

    result.financial_debits = calcFinancialDebits(result.additional_leverage_total, data.cdi);

    result.additional_leverage_cp = calcAdditionalLeverageCP(result.additional_leverage_total, data.target_term);

    result.total_revenue = result.gross_result || 0;

    result.total_debit = calcTotalDebit(data.onerous_liability_cp, data.onerous_liability_lp);

    calculateIndicators(data, {});

    return result;
}

function calcGrowth(net_income_year_before, net_income) {
    if(parseFloat(net_income_year_before) == 0) {
        return "";
    }

    return ((parseFloat(net_income) - parseFloat(net_income_year_before)) / parseFloat(net_income_year_before)) * 100;
}

function calcGrossResult(net_income, sold_product_cost) {
    if(isNaN(parseFloat(net_income) - parseFloat(sold_product_cost))) {
        return "";
    }

    return parseFloat(net_income) - parseFloat(sold_product_cost);
}

function calcOperationalResult(gross_result, adm_cost = 0, sell_team_cost = 0, op_cost = 0) {
    if(isNaN(gross_result - parseFloat(adm_cost) - parseFloat(sell_team_cost) - parseFloat(op_cost))) {
        return "";
    }

    return gross_result - parseFloat(adm_cost) - parseFloat(sell_team_cost) - parseFloat(op_cost);
}

function calcEbitda(operational_result, depreciation = 0) {
    if(isNaN(operational_result)) {
        return 0;
    }

    return operational_result + parseFloat(depreciation);
}

function calcLiquidProfitBeforeIR(operational_result, financial_result = 0, rev_exp_no_rec = 0, other = 0) {
    if(isNaN(operational_result + parseFloat(financial_result) + parseFloat(rev_exp_no_rec) + parseFloat(other))) {
        return "";
    }

    return operational_result + parseFloat(financial_result) + parseFloat(rev_exp_no_rec) + parseFloat(other);
}

function calcLiquidProfit(liquid_profit_before_ir, exp_ir_csll = 0) {
    if(isNaN(liquid_profit_before_ir - parseFloat(exp_ir_csll))) {
        return "";
    }

    return liquid_profit_before_ir - parseFloat(exp_ir_csll);
}

function calcTotalTaxLiability(taxes_cp, taxes_lp) {
    if(isNaN(parseFloat(taxes_cp) + parseFloat(taxes_lp))) {
        return "";
    }

    return parseFloat(taxes_cp) + parseFloat(taxes_lp);
}

function calcLiquidDebit(taxes_cp, taxes_lp) {
    if(isNaN(parseFloat(taxes_cp) + parseFloat(taxes_lp))) {
        return "";
    }

    return parseFloat(taxes_cp) + parseFloat(taxes_lp);
}

function calcLiquidDebitWithLiability(liquid_debit, total_tax_liability) {
    if(isNaN(liquid_debit + total_tax_liability)) {
        return "";
    }

    return liquid_debit + total_tax_liability;
}

function calcKVariation(customer_receive_year_before = 0, stock_year_before = 0, bills_pay_before = 0, customer_receive = 0, stock = 0, bills_pay = 0) {
    let k_variation = Math.max(parseFloat(customer_receive), 0) + Math.max(parseFloat(stock), 0) - Math.max(parseFloat(bills_pay), 0);

    let k_variation_year_before = Math.max(parseFloat(customer_receive_year_before), 0) + Math.max(parseFloat(stock_year_before), 0) - Math.max(parseFloat(bills_pay_before), 0);

    if(isNaN(k_variation - k_variation_year_before)) {
        return ""
    }

    return k_variation - k_variation_year_before;
}

function calcFinancialDebits(additional_leverage_total, cdi = 0) {
    if(additional_leverage_total == 0) {
        return 0;
    }

    return ((parseFloat(cdi) + 8) / additional_leverage_total) * -1;
}

function calcAdditionalLeverage(leverage_quotient = 0, target_value = 0) {
    if(isNaN(parseFloat(leverage_quotient) * parseFloat(target_value))) {
        return 0;
    }

    return parseFloat(leverage_quotient) * parseFloat(target_value);
}

function calcAdditionalLeverageCP(additional_leverage_total, target_term) {
    if(parseFloat(target_term) == 0) {
        return 0;
    }

    return (additional_leverage_total * 12) / parseFloat(target_term);
}

function calcTotalDebit(onerous_liability_cp, onerous_liability_lp) {
    if(isNaN(parseFloat(onerous_liability_cp) + parseFloat(onerous_liability_lp))) {
        return 0;
    }

    return parseFloat(onerous_liability_cp) + parseFloat(onerous_liability_lp);
}

function calculateIndicators(data = {}, options) {
    const result = Object.assign({}, data);
    options = options || defaultOptions;

    result.anual_gross_revenue = calcGrossRevenue(data.gross_result, data.month_quantity);
    result.liquid_revenue = calcLiquidRevenue(data.net_income, data.month_quantity);
    result.equity = parseFloat(data.liquid_assets);
    result.ebitda = calcLajida(data._ebitda, data.month_quantity);
    result.ebitda_by_net_revenue = calcLajidaNetRevenue(result.ebitda, esult.liquid_revenue);
    result.net_earnings = calcNetEarnings(data.liquid_profit, data.month_quantity);
    result.net_earnings_by_net_revenue = calcNetEarningsNetRevenue(result.net_earnings, result.liquid_revenue);
    result.net_debt_by_equity = calcNetDebitEquity(data.additional_leverage_total, data.liquid_debit, data.liquid_assets);
    result.net_debt_by_ebitda = calcNetDebitEbitda(data.liquid_debit, data.additional_leverage_total, result.ebitda, data.month_quantity);
    result.net_debt_plus_taxes_by_ebitda = calcNetDebitTaxesEbitda(data.liquid_debit_with_liability, data.additional_leverage_tota, result.ebitda);
    result.net_debt_by_ebitda_interest = calcNetDebitEbitdaInterest(data.liquid_debit, data.additional_leverage_total, data.financial_result, data.financial_debits, data._ebitda, data.month_quantity);
    result.gross_debt_by_monthly_revenue = calcGrossDebtMonthlyRevenue(data.onerous_liability_cp, data.onerous_liability_lp, data.additional_leverage_total, data.gross_result, data.month_quantity);
    result.current_debt_by_monthly_revenue = calcCurrentDebtMonthlyRevenue(data.onerous_liability_cp, data.additional_leverage_total, data.gross_result, data.month_quantity);
    result.current_ratio = calcCurrentRatio(data.current_assets, data.liability_cp);
    result.quick_ratio = calcQuickRatio(data.current_assets, data.stock, data.liability_cp);
    result.debt_ratio = calcDebitRatio(data.current_assets, data.no_current_assets, data.abilities_cp, data.liabilities_lp);
    result.interest_coverage = calcInterestCoverage(data._ebitda, data.financial_result, data.financial_debits);
    result.interest_coveraty_minus_working_capital = calcInterestCoveratyMinusWorkingCapital(data._ebitda, data.financial_result, data.financial_debits, data.k_variation);
    result.usd_income = !isNaN(parseFloat(data.dollar_revenue) / parseFloat(data.gross_revenue)) ? parseFloat(data.dollar_revenue) / parseFloat(data.gross_revenue) : "";
    result.default_ninetydays_by_equity = calcDefaultNinetydaysEquity(data.liquid_assets, data.serasa, data.refin);
}

function calcGrossRevenue(gross_revenue, month_quantity) {
    if(parseFloat(month_quantity) != 0) {
        return parseFloat(gross_revenue)/parseInt(month_quantity) * 12;
    }

    return "";
}

function calcLiquidRevenue(net_income, month_quantity) {
    if(parseFloat(month_quantity) != 0) {
        return parseFloat(net_income)/parseInt(month_quantity) * 12;
    }

    return "";
}

function calcLajida(ebitda, month_quantity) {
    if(parseFloat(month_quantity) != 0) {
        return parseFloat(ebitda)/parseFloat(month_quantity) * 12;
    }

    return "";
}

function calcLajidaNetRevenue(ebitda, liquid_revenue) {
    if(parseFloat(liquid_revenue) != 0) {
        return (ebitda/ liquid_revenue) * 100;
    }

    return "";
}

function calcNetEarnings(liquid_profit, month_quantity) {
    if(parseFloat(month_quantity) != 0) {
        return parseFloat(liquid_profit)/parseInt(month_quantity) * 12;
    }

    return "";
}

function calcNetEarningsNetRevenue(net_earnings, liquid_revenue) {
    if(parseFloat(liquid_revenue) != 0) {
        return (net_earnings/ liquid_revenue) * 100;
    }

    return "";
}

function calcNetDebitEquity(additional_leverage_total, liquid_debit, liquid_assets) {
    if(parseFloat(liquid_assets) != 0) {
        return (parseFloat(liquid_debit) + parseFloat(additional_leverage_total)) / parseFloat(liquid_assets);
    }

    return "";
}

function calcNetDebitEbitda(additional_leverage_total, liquid_debit, ebitda, month_quantity) {
    if(ebitda <= 0 || month_quantity <= 0) {
        return 100;
    }

    const yearProjection = (parseInt(ebitda)/parseInt(month_quantity)) * 12;

    return (parseFloat(liquid_debit) + parseFloat(additional_leverage_total)) / yearProjection;
}

function calcNetDebitTaxesEbitda(liquid_debit_with_liability, additional_leverage_total, ebitda) {
    if(parseFloat(ebitda) != 0) {
       return  (parseFloat(liquid_debit_with_liability) + additional_leverage_total) / parseFloat(ebitda);
    }

    return "";
}

function calcNetDebitEbitdaInterest(liquid_debit, additional_leverage_total, financial_result, financial_debits, ebitda, month_quantity) {
    if(parseFloat(ebitda) <= 0 || parseFloat(ebitda) + parseFloat(financial_result) <= 0) {
       return  100;
    }

    const ebitdaResut = parseFloat(ebitda) + parseFloat(financial_result);

    const yearProjectionResult = month_quantity * 12;

    return (liquid_debit + additional_leverage_total) / ((ebitdaResut/yearProjectionResult) + financial_debits);
}

function calcGrossDebtMonthlyRevenue(onerous_liability_cp, onerous_liability_lp, additional_leverage_total, gross_result, month_quantity) {
    if(parseFloat(gross_result) != 0 && parseFloat(month_quantity) != 0) {
        return (onerous_liability_cp + onerous_liability_lp + additional_leverage_total) / (gross_result/month_quantity);
    }

    return "";
}

function calcCurrentDebtMonthlyRevenue(onerous_liability_cp, additional_leverage_total, gross_result, month_quantity) {
    if(parseFloat(gross_result) != 0 && parseFloat(month_quantity) != 0) {
        return (onerous_liability_cp + additional_leverage_total) / (gross_result/month_quantity);
    }

    return "";
}

function calcCurrentRatio(current_assets, liabilities_cp) {
    if(parseFloat(liabilities_cp) != 0) {
        return parseFloat(current_assets)/parseFloat(liabilities_cp);
    }

    return "";
}

function calcQuickRatio(current_assets, stock = 0, liabilities_cp) {
    if(parseFloat(liabilities_cp) != 0) {
        return (parseFloat(current_assets) - parseFloat(stock))/parseFloat(liabilities_cp);
    }

    return "";
}

function calcDebitRatio(current_assets, no_current_assets, liabilities_cp, liabilities_lp) {
    if(parseFloat(liabilities_cp) + parseFloat(liabilities_lp) > 0) {
        return (parseFloat(current_assets) + parseFloat(no_current_assets))/(parseFloat(liabilities_cp) + parseFloat(liabilities_lp));
    }

    return "";
}

function calcInterestCoverage(ebitda, financial_result, financial_debits) {
    const financial = (parseFloat(financial_result) + parseFloat(financial_debits)) * -1;

    if(ebitda <= 0) {
        return 0;
    }

    if(financial_result >= 0) {
        return 100;
    }

    if(financial != 0) {
        return ebitda/financial;
    }

    return "";
}

function calcInterestCoveratyMinusWorkingCapital(ebitda, financial_result, financial_debits, k_variation) {
    const financial = (parseFloat(financial_result) + parseFloat(financial_debits) - parseFloat(k_variation)) * -1;

    if (ebitda <= 0) {
        return 0;
    }

    if (financial_result >= 0) {
        return 100;
    }

    if (financial != 0) {
        return ebitda / financial;
    }

    return "";
}

function calcDefaultNinetydaysEquity(liquid_assets, serasa, refin) {
    if(liquid_assets <= 0 && (serasa + refin) > 0) {
        return 10;
    }

    return (serasa + refin)/liquid_assets;
}

// CDI
// all with year before
// target_value
// leverage_quotient
// target_term
//Serasa and refin value

//adicionar ativo circulante tabela de dre e balanço = current_assets

//adicionar leverage_quotient para ser colocado pelo bo


window.module = window.module || {};

module.exports = {
    calculateDREBalance
};
import { Box, Button, Typography, styled } from '@mui/material'
import { Refresh, WarningAmber } from '@mui/icons-material'

const Wrapper = styled(Box)`
    width: 100%;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 28px;
    box-sizing: border-box;
`

const Content = styled(Box)`
    width: 100%;
    max-width: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    padding: 28px 24px;
    border: 1px solid #ead7d4;
    border-radius: 8px;
    background: #fffafa;
    box-shadow: 0 10px 28px rgba(17, 27, 33, 0.07);
`

const IconWrap = styled(Box)`
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #fdecea;
    color: #c0392b;
`

const Detail = styled(Typography)`
    color: #667781;
    font-size: 13px;
    line-height: 1.5;
`

const ErrorState = ({
    title = 'Something went wrong',
    message,
    detail,
    status,
    actionLabel = 'Try again',
    onRetry
}) => {
    return (
        <Wrapper>
            <Content>
                <IconWrap>
                    <WarningAmber />
                </IconWrap>
                <Typography variant="subtitle1" sx={{ color: '#2f3337', fontWeight: 700 }}>
                    {title}
                </Typography>
                {message && (
                    <Detail>
                        {message}
                    </Detail>
                )}
                {(status || detail) && (
                    <Detail>
                        {status ? `Status ${status}` : ''}
                        {status && detail ? ' - ' : ''}
                        {detail}
                    </Detail>
                )}
                {onRetry && (
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<Refresh />}
                        onClick={onRetry}
                        sx={{ mt: 1, textTransform: 'none', fontWeight: 600 }}
                    >
                        {actionLabel}
                    </Button>
                )}
            </Content>
        </Wrapper>
    )
}

export default ErrorState

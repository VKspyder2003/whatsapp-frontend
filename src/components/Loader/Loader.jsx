import { Box, CircularProgress, Typography, styled } from "@mui/material"

const Wrapper = styled(Box, {
    shouldForwardProp: (prop) => !['fullPage', 'fill', 'compact'].includes(prop)
})(({ fullPage, fill, compact }) => ({
    width: '100%',
    minHeight: fullPage ? '100vh' : fill ? '100%' : compact ? '120px' : '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: fullPage ? '#f0f2f5' : 'transparent',
    padding: compact ? '16px' : '32px',
    boxSizing: 'border-box'
}))

const Content = styled(Box, {
    shouldForwardProp: (prop) => prop !== 'compact'
})(({ compact }) => ({
    minWidth: compact ? 'auto' : '220px',
    maxWidth: '320px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: compact ? '10px' : '14px',
    padding: compact ? '0' : '24px 28px',
    borderRadius: compact ? 0 : 8,
    background: compact ? 'transparent' : 'rgba(255, 255, 255, 0.82)',
    boxShadow: compact ? 'none' : '0 12px 32px rgba(17, 27, 33, 0.08)',
    textAlign: 'center'
}))

const Loader = ({ message = 'Loading...', fullPage = false, fill = false, compact = false, size = 38 }) => {
    return (
        <Wrapper fullPage={fullPage} fill={fill} compact={compact}>
            <Content compact={compact}>
                <CircularProgress
                    size={compact ? Math.min(size, 28) : size}
                    thickness={4}
                    sx={{ color: '#00a884' }}
                />
                {message && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#54656f',
                            fontWeight: 500,
                            lineHeight: 1.45
                        }}
                    >
                        {message}
                    </Typography>
                )}
            </Content>
        </Wrapper>
    )
}

export default Loader;
